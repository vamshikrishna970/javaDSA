// find maximum in an ArrayList
import java.util.ArrayList;

public class max {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();

        // sample data - replace or extend as needed
        list.add(3);
        list.add(5);
        list.add(2);
        list.add(9);
        list.add(1);

        int MAX = Integer.MIN_VALUE;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) > MAX) {
                MAX = list.get(i);
            }
        }

        System.out.println("Maximum element is: " + MAX);
    }
}
