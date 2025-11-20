import java.util.ArrayList;
public class storeWater {
    public static int storeWater(ArrayList<Integer> height) {
        int left = 0;
        int right = height.size() - 1;
        int maxArea = 0;

        while (left < right) {
            int minHeight = Math.min(height.get(left), height.get(right));
            int width = right - left;
            int currentArea = minHeight * width;
            maxArea = Math.max(maxArea, currentArea);

            if (height.get(left) < height.get(right)) {
                left++;
            } else {
                right--;
            }
        }

        return maxArea;
    }

    public static void main(String[] args) {
        ArrayList<Integer> height = new ArrayList<>();
        height.add(1);
        height.add(8);
        height.add(6);
        height.add(2);
        height.add(5);
        height.add(4);
        height.add(8);
        height.add(3);
        height.add(7);

        int result = storeWater(height);
        System.out.println("Maximum water that can be stored: " + result);
    }
}