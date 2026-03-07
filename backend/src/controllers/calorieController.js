// /**
//  * Calorie Calculator Controller
//  *
//  * Uses the Mifflin-St Jeor Equation for BMR calculation:
//  * - Men:   BMR = (10 × weight) + (6.25 × height) − (5 × age) + 5
//  * - Women: BMR = (10 × weight) + (6.25 × height) − (5 × age) − 161
//  *
//  * Activity multipliers: sedentary=1.2, light=1.375, moderate=1.55, active=1.725, very active=1.9
//  * Goal adjustment: maintain=0, lose=-400, gain=+400
//  * Protein: 1.6g per kg body weight
//  */
// import prisma from '../lib/prisma.js';
// import { getUserId } from '../middleware/user.js';

// const ACTIVITY_FACTORS = {
//   sedentary: 1.2,
//   light: 1.375,
//   moderate: 1.55,
//   active: 1.725,
//   'very active': 1.9,
// };

// const PROTEIN_PER_KG = 1.6;

// /**
//  * POST /api/calorie/calculate
//  * Calculates BMR, daily calories, and protein target. Optionally saves to nutrition_goals.
//  */
// export async function calculateCalories(req, res) {
//   try {
//     // const userId = getUserId(req);
//     const userId = await getUserId(req);
//     const { weight, height, age, gender, activityLevel, goal, save = true } = req.body;

//     // Validate required inputs
//     const w = Number(weight);
//     const h = Number(height);
//     const a = Number(age);
//     if (!w || !h || !a || !gender || !activityLevel || !goal) {
//       return res.status(400).json({
//         error: 'Missing required fields: weight, height, age, gender, activityLevel, goal',
//       });
//     }

//     const factor = ACTIVITY_FACTORS[activityLevel.toLowerCase()];
//     if (!factor) {
//       return res.status(400).json({
//         error: 'Invalid activityLevel. Use: sedentary, light, moderate, active, very active',
//       });
//     }

//     // Mifflin-St Jeor Equation
//     const bmr =
//       gender.toLowerCase() === 'male'
//         ? 10 * w + 6.25 * h - 5 * a + 5
//         : 10 * w + 6.25 * h - 5 * a - 161;

//     // Total Daily Energy Expenditure (TDEE) = BMR × activity factor
//     let dailyCalories = Math.round(bmr * factor);

//     // Goal adjustment
//     if (goal.toLowerCase() === 'lose weight') {
//       dailyCalories -= 400;
//     } else if (goal.toLowerCase() === 'gain weight') {
//       dailyCalories += 400;
//     }
//     dailyCalories = Math.max(0, dailyCalories);

//     // Protein target: 1.6g per kg
//     const proteinTarget = Math.round(w * PROTEIN_PER_KG);

//     const result = {
//       bmr: Math.round(bmr),
//       dailyCalories,
//       proteinTarget,
//     };

//     if (save) {
//       const nutritionGoal = await prisma.nutritionGoal.create({
//         data: {
//           userId,
//           weight: w,
//           height: h,
//           age: a,
//           activityLevel: activityLevel.toLowerCase(),
//           goal: goal.toLowerCase(),
//           dailyCalories,
//           proteinTarget,
//         },
//       });
//       result.saved = true;
//       result.goalId = nutritionGoal.id;
//     }

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Failed to calculate calories' });
//   }
// }

// /**
//  * GET /api/calorie/goals
//  * Returns the user's most recent nutrition goal from the calorie calculator.
//  */
// export async function getCalorieGoals(req, res) {
//   try {
//     // const userId = getUserId(req);
//     const userId = await getUserId(req);
//     const goal = await prisma.nutritionGoal.findFirst({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//     });
//     res.json(goal || null);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Failed to fetch calorie goals' });
//   }
// }
import prisma from '../lib/prisma.js';
import { getUserId } from '../middleware/user.js';

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very active': 1.9,
};

const PROTEIN_PER_KG = 1.6;

export async function calculateCalories(req, res) {
  try {
    // ensure userId is always a string
    const userIdRaw = await getUserId(req);
    // const userId = String(userIdRaw);
    const userId = await getUserId(req);

    const { weight, height, age, gender, activityLevel, goal, save = true } = req.body;

    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);

    if (!w || !h || !a || !gender || !activityLevel || !goal) {
      return res.status(400).json({
        error: 'Missing required fields: weight, height, age, gender, activityLevel, goal',
      });
    }

    const factor = ACTIVITY_FACTORS[activityLevel.toLowerCase()];
    if (!factor) {
      return res.status(400).json({
        error: 'Invalid activityLevel. Use: sedentary, light, moderate, active, very active',
      });
    }

    // Mifflin-St Jeor Equation
    const bmr =
      gender.toLowerCase() === 'male'
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    let dailyCalories = Math.round(bmr * factor);

    if (goal.toLowerCase() === 'lose weight') {
      dailyCalories -= 400;
    } else if (goal.toLowerCase() === 'gain weight') {
      dailyCalories += 400;
    }

    dailyCalories = Math.max(0, dailyCalories);

    const proteinTarget = Math.round(w * PROTEIN_PER_KG);

    const result = {
      bmr: Math.round(bmr),
      dailyCalories,
      proteinTarget,
    };

    if (save) {
      const nutritionGoal = await prisma.nutritionGoal.create({
        data: {
          userId,
          weight: w,
          height: h,
          age: a,
          activityLevel: activityLevel.toLowerCase(),
          goal: goal.toLowerCase(),
          dailyCalories,
          proteinTarget,
        },
      });

      result.saved = true;
      result.goalId = nutritionGoal.id;
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to calculate calories' });
  }
}

export async function getCalorieGoals(req, res) {
  try {
    const userIdRaw = await getUserId(req);
    // const userId = String(userIdRaw);
    const userId = await getUserId(req);

    const goal = await prisma.nutritionGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(goal || null);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch calorie goals' });
  }
}