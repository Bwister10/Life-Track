# Life Goals & Habits Dashboard - Feature Explanations

## 1. **Overdue Status in Goal Cards**

### What is "Overdue"?
A goal becomes **"overdue"** when:
- The current date has passed the goal's deadline date
- AND the goal is not yet completed (progress < 100%)

### How it works:
```javascript
// In Dashboard.tsx (line 94-95)
if (new Date(goal.deadline) < new Date() && goal.status !== 'completed') {
  return { ...goal, status: 'overdue' as const };
}
```

### Visual Indicators:
- **Red badge** with "Overdue" text
- Appears in the bottom-right corner of the goal card
- Helps users identify goals that need immediate attention

### Example:
- Goal deadline: January 15, 2024
- Today's date: January 20, 2024
- Status: **Overdue** (shown in red)

---

## 2. **Habit Card Calendar System**

### How the 7-Day Calendar Works:

The habit card displays the **last 7 days** (including today) in a grid format.

### Dynamic Date Calculation:
```javascript
// In HabitCard.tsx (line 23-31)
const getLastSevenDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);  // Goes back i days from today
    days.push(date);
  }
  return days;
};
```

### How it Updates Daily:
1. **Automatic Update**: Every time you open the app, it calculates the last 7 days from TODAY
2. **Rolling Window**: As days pass, older days "fall off" and new days appear
3. **Example**:
   - Monday: Shows Tue-Mon (last 7 days)
   - Tuesday: Shows Wed-Tue (last 7 days)
   - The oldest day disappears, newest day appears

### Visual States:
- **Green with checkmark**: Completed on that day
- **Blue border**: Today's date
- **Gray**: Not completed yet

### Data Storage:
- Completed dates are stored as strings: `['2024-01-15', '2024-01-16', '2024-01-17']`
- When you check a day, it adds that date to the array
- The calendar checks if each day exists in this array to show completion

---

## 3. **Deadline Date in Goal Form**

### How the Date Input Works:

### Default Value:
```javascript
// In GoalForm.tsx (line 27)
deadline: format(new Date(), 'yyyy-MM-dd')
```
- When creating a NEW goal: defaults to TODAY's date
- When EDITING a goal: shows the existing deadline date

### Date Format Conversion:
The form uses a two-step process:

#### Step 1: Display Format (for the input field)
```javascript
// Convert Date object to string for HTML input
deadline: format(goal.deadline, 'yyyy-MM-dd')
// Example: Date object → '2024-01-15'
```

#### Step 2: Storage Format (when saving)
```javascript
// Convert string back to Date object for storage
onSave({
  ...formData,
  deadline: new Date(formData.deadline)
});
// Example: '2024-01-15' → Date object
```

### Why This Conversion?
- **HTML `<input type="date">`** requires format: `YYYY-MM-DD` (string)
- **JavaScript Date objects** are better for calculations and comparisons
- **date-fns library** (`format` function) handles the conversion

### User Experience:
1. User clicks "Add Goal"
2. Date picker shows today's date by default
3. User can click to open calendar picker
4. User selects any future date
5. Form converts string to Date object before saving

### Example Flow:
```
User selects: January 25, 2024
↓
Input value: "2024-01-25" (string)
↓
On submit: new Date("2024-01-25") (Date object)
↓
Stored in localStorage as Date object
↓
Displayed on card: "Jan 25, 2024" (formatted string)
```

---

## Summary

1. **Overdue**: Goals past their deadline that aren't completed yet
2. **Habit Calendar**: Shows last 7 days, automatically updates daily
3. **Deadline Date**: Uses HTML date input, converts between string and Date object for proper storage and display
