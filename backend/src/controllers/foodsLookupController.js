// Common foods with per-100g (or per unit) values for auto-fill
const FOODS_DB = [
  { name: 'Chicken Breast', caloriesPer100: 165, proteinPer100: 31, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Eggs', caloriesPerUnit: 70, proteinPerUnit: 6, defaultUnit: 'piece', defaultQuantity: 1 },
  { name: 'Rice (cooked)', caloriesPer100: 130, proteinPer100: 2.7, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Broccoli', caloriesPer100: 34, proteinPer100: 2.8, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Salmon', caloriesPer100: 208, proteinPer100: 20, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Oatmeal', caloriesPer100: 68, proteinPer100: 2.4, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Banana', caloriesPer100: 89, proteinPer100: 1.1, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Greek Yogurt', caloriesPer100: 59, proteinPer100: 10, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Whey Protein', caloriesPer100: 400, proteinPer100: 80, defaultUnit: 'g', defaultQuantity: 30 },
  { name: 'Sweet Potato', caloriesPer100: 86, proteinPer100: 1.6, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Tuna', caloriesPer100: 132, proteinPer100: 28, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Almonds', caloriesPer100: 579, proteinPer100: 21, defaultUnit: 'g', defaultQuantity: 28 },
  { name: 'Milk (whole)', caloriesPer100: 61, proteinPer100: 3.2, defaultUnit: 'ml', defaultQuantity: 100 },
  { name: 'Avocado', caloriesPer100: 160, proteinPer100: 2, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Brown Rice', caloriesPer100: 112, proteinPer100: 2.6, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Quinoa', caloriesPer100: 120, proteinPer100: 4.4, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Cottage Cheese', caloriesPer100: 98, proteinPer100: 11, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Turkey Breast', caloriesPer100: 135, proteinPer100: 30, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Spinach', caloriesPer100: 23, proteinPer100: 2.9, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Apple', caloriesPer100: 52, proteinPer100: 0.3, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Beef (lean)', caloriesPer100: 250, proteinPer100: 26, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Peanut Butter', caloriesPer100: 588, proteinPer100: 25, defaultUnit: 'g', defaultQuantity: 32 },
  { name: 'Pasta', caloriesPer100: 131, proteinPer100: 5, defaultUnit: 'g', defaultQuantity: 100 },
  { name: 'Bread (whole wheat)', caloriesPer100: 247, proteinPer100: 13, caloriesPerUnit: 80, proteinPerUnit: 4, defaultUnit: 'slice', defaultQuantity: 1 },
  { name: 'Protein Bar', caloriesPerUnit: 200, proteinPerUnit: 20, defaultUnit: 'piece', defaultQuantity: 1 },
];

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchFoods(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json(
        FOODS_DB.map((food) => ({
          ...food,
          suggestedCalories: food.caloriesPer100 ?? food.caloriesPerUnit,
          suggestedProtein: food.proteinPer100 ?? food.proteinPerUnit,
          suggestedQuantity: food.defaultQuantity,
          suggestedUnit: food.defaultUnit,
        }))
      );
    }
    const norm = normalize(q);
    const matches = FOODS_DB.filter((f) => normalize(f.name).includes(norm)).map((food) => {
      const calories = food.caloriesPer100 != null ? food.caloriesPer100 : food.caloriesPerUnit;
      const protein = food.proteinPer100 != null ? food.proteinPer100 : food.proteinPerUnit;
      return {
        ...food,
        suggestedCalories: calories,
        suggestedProtein: protein,
        suggestedQuantity: food.defaultQuantity,
        suggestedUnit: food.defaultUnit,
      };
    });
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Search failed' });
  }
}

export function calculateNutrition(req, res) {
  try {
    const { foodName, quantity, unit } = req.query;
    const qty = parseFloat(quantity) || 1;
    const food = FOODS_DB.find((f) => normalize(f.name) === normalize(foodName || ''));
    if (!food) {
      return res.json({ calories: null, protein: null, found: false });
    }
    let calories, protein;
    if (food.caloriesPer100 != null && (unit === 'g' || unit === 'ml')) {
      const factor = qty / 100;
      calories = Math.round(food.caloriesPer100 * factor * 10) / 10;
      protein = Math.round(food.proteinPer100 * factor * 10) / 10;
    } else if (food.caloriesPerUnit != null) {
      calories = Math.round(food.caloriesPerUnit * qty * 10) / 10;
      protein = Math.round((food.proteinPerUnit || 0) * qty * 10) / 10;
    } else {
      const factor = qty / 100;
      calories = Math.round(food.caloriesPer100 * factor * 10) / 10;
      protein = Math.round(food.proteinPer100 * factor * 10) / 10;
    }
    res.json({ calories, protein, found: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
