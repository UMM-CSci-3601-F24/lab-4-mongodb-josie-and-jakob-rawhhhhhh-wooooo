package umm3601.todo;


import org.mongojack.Id;
import org.mongojack.ObjectId;


@SuppressWarnings({"VisibilityModifier"})
public class Todo {

    @ObjectId @Id
    @SuppressWarnings({"memberName"})
    public String _id;
    public String owner;
    public String category;
    public String body;
    public boolean status;

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Todo)) {
            return false;
        }
        Todo other = (Todo) obj;
        return _id.equals(other._id);
    }

    @Override
    public int hashCode() {
        return +_id.hashCode();
    }

    @Override
    public String toString() {
        return body;
    }
}
