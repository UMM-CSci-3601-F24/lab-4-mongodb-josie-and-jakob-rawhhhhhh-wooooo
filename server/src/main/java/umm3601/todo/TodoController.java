package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import javax.swing.SortingFocusTraversalPolicy;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import kotlin.collections.Grouping;
import umm3601.Controller;



public class TodoController implements Controller {

    private static final String API_TODOS = "/api/todos";
    private static final String API_TODO_BY_ID = "/api/todos/{id}";
    static final String OWNER_KEY = "owner";
    static final String CATEGORY_KEY = "category";
    static final String BODY_KEY = "body";
    // static final Boolean STATUS_KEY = "status"; 
    
    private final JacksonMongoCollection<Todo> todoCollection;

    public TodoController(MongoDatabase database) {
        todoCollection = JacksonMongoCollection.builder().build(
            database,
            "todos",
            Todo.class,
            UuidRepresentation.STANDARD);
    }


    /**
     * @param ctx
     */
    public void getTodo(Context ctx) {
        String id = ctx.pathParam("id");
        Todo todo;

        try {
            todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
        } catch (IllegalArgumentException e) {
            throw new NotFoundResponse("The requested todo id wasn't a legal Mongo Object ID");
        }
        if (todo == null) {
            throw new NotFoundResponse("The requested todo was not found");
        } else {
            ctx.json(todo);
            ctx.status(HttpStatus.OK);
        }
    }

    /**
     * @param ctx
     */
    public void getTodos(Context ctx) {
        Bson comebinedFilter = constructFilter(ctx);
        Bson sortingOrder = constructSortingOrder(ctx);

        ArrayList<Todo> matchingTodos = todoCollection
            .find(comebinedFilter)
            .sort(sortingOrder)
            .into(new ArrayList<>());
        
        ctx.json(matchingTodos);
        ctx.status(HttpStatus.OK);
    }


    /**
     * @param ctx
     * 
     * @return
     */


    private Bson constructFilter(Context ctx) {
        List<Bson> filters = new ArrayList<>();


        Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

        return combinedFilter;
    }


    /**
     * @param ctx
     * 
     * @return
     */


private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "owner");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ? Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
}


public void addNewTodo(Context ctx) {

    String body = ctx.body();
    Todo newTodo = ctx.bodyValidator(Todo.class)
    .check(td-> td.owner != null && td.owner.length() > 0,
        "Todo must have a non-empty owner; body was " + body)
    .check(td -> td.category != null && td.category.length() > 0,
        "Todo must have a non-empty category; body was " + body)
    .check(td -> td.body != null && td.body.length() > 0,
        "Todo must have a non-empty body; body was " + body)
    .check(td -> !(td.status == true || td.status == false),
        "Todo must have a valid status; body was" + body)
    .get();

    todoCollection.insertOne(newTodo);
    ctx.json(Map.of("id", newTodo._id));
    ctx.status(HttpStatus.CREATED);
}

public void deleteTodo(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = todoCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (deleteResult.getDeletedCount() != 1) {
        ctx.status(HttpStatus.NOT_FOUND);
        throw new NotFoundResponse(
            "Was unable to delete ID "
            + id 
            + "; perhaps illegal ID or an ID for item not in the syetem?");
        }
        ctx.status(HttpStatus.OK);
    }



    public void addRoutes(Javalin server) {
        // Get the specified user
        server.get(API_TODO_BY_ID, this::getTodo);
    
        // List users, filtered using query parameters
        server.get(API_TODOS, this::getTodos);
    
        // Delete the specified user
        server.delete(API_TODO_BY_ID, this::deleteTodo);
    
        // Add new user with the user info being in the JSON body
        // of the HTTP request
        server.post(API_TODOS, this::addNewTodo);
      }

}



