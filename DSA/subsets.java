public class subsets {
    public static void findsubset(String str, String ans, int i) {
        // base case
        if (i == str.length()) {
            System.out.println(ans);
            return; 
    }
    // include
    findsubset(str, ans + str.charAt(i), i + 1);
    // exclude
    findsubset(str, ans, i + 1);
    }   
    public static void main(String[] args) {
        String str = "abc";
        findsubset(str, "", 0);
    }
}