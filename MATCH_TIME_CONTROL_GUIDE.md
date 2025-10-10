# ⏱️ Match Time Control - User Guide

## 🎯 Overview

The match time is now **manually controlled** by the admin for accuracy. This is perfect for football because:

- ✅ **Stoppages don't affect time** (injuries, substitutions)
- ✅ **Half-time doesn't count** (you pause at 45', resume at 46')
- ✅ **Stoppage time** can be added (90+3', etc.)
- ✅ **100% accurate** to the actual match

---

## 🎮 How to Control Match Time

### When Match is Live:

You'll see a **Match Time** control card with:

```
Match Time
  [ - ]   67'   [ + ]
Tap minute to set manually
```

### Three Ways to Update Time:

#### 1. **Increment (+1 minute)**
- Tap the **[ + ]** button
- Adds 1 minute to current time
- Quick for normal game flow

#### 2. **Decrement (-1 minute)**
- Tap the **[ - ]** button
- Removes 1 minute
- Useful if you accidentally went too far

#### 3. **Set Exact Minute**
- **Tap on the minute number** (e.g., "67'")
- Dialog appears
- Type exact minute (0-120)
- Tap "Set"
- Perfect for jumping to specific times

---

## ⚽ Football Match Timeline

### First Half (0-45 minutes)
1. Start match → Time begins at **0'**
2. Use **[ + ]** button as match progresses
3. At half-time → Set to **45'**
4. Add event: "Half Time"

### Half-Time Break
- **Don't touch the time** during break
- Time stays at 45'

### Second Half (46-90 minutes)
1. Resume → Tap **[ + ]** to go to **46'**
2. Continue incrementing as match progresses
3. At 90 minutes → **90'**

### Stoppage Time (90+)
1. After 90', keep incrementing
2. **90+1'**, **90+2'**, **90+3'**, etc.
3. Or tap minute and set to **91**, **92**, **93**, etc.

### Extra Time (if needed)
- First half extra time: **91-105'**
- Second half extra time: **106-120'**

---

## 📝 Best Practices

### During Match:

**Option A: Manual Increment (Recommended)**
- Watch the real match
- Press **[ + ]** every minute
- Most accurate method

**Option B: Periodic Updates**
- Update every 5 minutes
- Tap minute → Set to **5**, **10**, **15**, etc.
- Less work, still accurate for events

**Option C: Event-Based**
- Update time only when adding events
- Tap minute → Set current time
- Quick and simple

### For Events:

When you add a goal/card/etc.:
1. **First**: Update the match minute
2. **Then**: Add the event
3. Event will automatically use current minute

**Example:**
```
Real match: 67th minute, goal scored
1. Tap minute → Set to 67
2. Tap "⚽ Goal" button
3. Event recorded as "67' ⚽ GOAL!"
```

---

## 🎯 Common Scenarios

### Scenario 1: Match Start
```
Action: Tap "Start Match"
Result: Time set to 0'
Display: "0' 🏁 Match started"
```

### Scenario 2: First Half Goal (23rd minute)
```
1. Tap minute → Set to 23
2. Tap "⚽ Goal" button
Result: "23' ⚽ GOAL! Nkoroi FC scores!"
```

### Scenario 3: Half Time
```
1. Tap minute → Set to 45
2. Tap "⏸️ Half Time" button
Result: "45' ⏸️ Half Time"
Time stays at 45' during break
```

### Scenario 4: Second Half Resumes
```
1. Tap [ + ] button
Result: Time changes to 46'
Continue match
```

### Scenario 5: Stoppage Time Goal (92nd minute)
```
1. Tap minute → Set to 92
2. Tap "⚽ Goal" button
Result: "92' ⚽ GOAL! Nkoroi FC scores!"
WhatsApp: "⚽ GOAL! ... ⏱️ 92'"
```

### Scenario 6: Full Time
```
1. Tap minute → Set to 90 (or 93, 94, etc.)
2. Tap "🏆 End Match" button
Result: "90' 🏆 Full Time"
```

---

## 💡 Pro Tips

### 1. **Keep Phone Nearby**
- Have your phone ready during match
- Quick access to increment button

### 2. **Assign Someone**
- Have a dedicated person manage time
- They focus on time, you focus on events

### 3. **Use Shortcuts**
- **[ + ]** for normal flow
- **Tap minute** for big jumps (half-time, etc.)

### 4. **Don't Worry About Perfection**
- Being within 1-2 minutes is fine
- Events are what matter most

### 5. **Stoppage Time**
- Just keep incrementing past 90
- Or set to 91, 92, 93, etc.

---

## 🔧 Technical Details

### Time Range:
- **Minimum**: 0 minutes
- **Maximum**: 120 minutes (allows for extra time)

### Storage:
- Current minute saved in match data
- Persists even if app closes
- Synced across all users

### Events:
- Each event records the minute it occurred
- Minute is taken from current match time
- Cannot be changed after event is created

---

## ❓ FAQ

**Q: What if I forget to update the time?**
A: Just set it to the correct minute before adding the next event.

**Q: Can I go backwards?**
A: Yes! Use the **[ - ]** button or tap minute to set lower value.

**Q: What happens at half-time?**
A: Time stays at 45'. When second half starts, increment to 46'.

**Q: How do I handle stoppage time?**
A: Just keep incrementing past 90 (91, 92, 93...) or set manually.

**Q: What if match goes to extra time?**
A: Continue to 120 minutes. System supports up to 120'.

**Q: Does time auto-increment?**
A: No. You have full manual control for accuracy.

**Q: What if I set wrong minute for an event?**
A: Currently events can't be edited. Be careful before adding!

---

## 📱 User Interface

### Match Time Card (Live Matches Only):

```
┌─────────────────────────────┐
│       Match Time            │
│                             │
│   [ - ]   67'   [ + ]      │
│                             │
│ Tap minute to set manually  │
└─────────────────────────────┘
```

### Set Minute Dialog:

```
┌─────────────────────────────┐
│   Set Match Minute          │
│                             │
│ Enter current match minute  │
│ (0-120):                    │
│                             │
│ ┌─────────────────────┐    │
│ │  [    45    ]       │    │
│ └─────────────────────┘    │
│                             │
│   [Cancel]      [Set]       │
└─────────────────────────────┘
```

---

## ✅ Summary

**Manual time control gives you:**
- ✅ Accurate match minutes
- ✅ Control over stoppages
- ✅ Easy stoppage time handling
- ✅ Perfect for real football matches

**Remember:**
1. Update time before adding events
2. Use **[ + ]** for normal flow
3. **Tap minute** for big jumps
4. Time range: 0-120 minutes

---

**Now your match events will have accurate timestamps just like professional football coverage!** ⚽⏱️
