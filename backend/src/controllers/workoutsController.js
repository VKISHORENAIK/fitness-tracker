// // // import prisma from '../lib/prisma.js';
// // // import { getUserId } from '../middleware/user.js';

// // // export async function addWorkout(req, res) {
// // //   try {
// // //     const userId = getUserId(req);
// // //     const { name, date, notes, exercises } = req.body;

// // //     const workout = await prisma.workout.create({
// // //       data: {
// // //         userId,
// // //         name: name || 'Workout',
// // //         date: date ? new Date(date) : new Date(),
// // //         notes: notes || null,
// // //         exercises: exercises?.length
// // //           ? {
// // //               create: exercises.map((e) => ({
// // //                 name: e.name,
// // //                 sets: e.sets,
// // //                 reps: e.reps,
// // //                 weight: parseFloat(e.weight) || 0,
// // //                 notes: e.notes || null,
// // //               })),
// // //             }
// // //           : undefined,
// // //       },
// // //       include: { exercises: true },
// // //     });
// // //     res.status(201).json(workout);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: err.message || 'Failed to add workout' });
// // //   }
// // // }

// // // export async function getWorkouts(req, res) {
// // //   try {
// // //     const userId = getUserId(req);
// // //     const { from, to } = req.query;

// // //     const where = { userId };
// // //     if (from || to) {
// // //       where.date = {};
// // //       if (from) where.date.gte = new Date(from);
// // //       if (to) where.date.lte = new Date(to);
// // //     }

// // //     const workouts = await prisma.workout.findMany({
// // //       where,
// // //       include: { exercises: true },
// // //       orderBy: { date: 'desc' },
// // //     });
// // //     res.json(workouts);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: err.message || 'Failed to fetch workouts' });
// // //   }
// // // }

// // // export async function deleteWorkout(req, res) {
// // //   try {
// // //     const userId = getUserId(req);
// // //     const { id } = req.params;
// // //     await prisma.workout.deleteMany({ where: { id, userId } });
// // //     res.status(204).send();
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: err.message || 'Failed to delete workout' });
// // //   }
// // // }

// // import prisma from '../lib/prisma.js';
// // import { getUserId } from '../middleware/user.js';

// // export async function addWorkout(req, res) {
// //   try {
// //     const userId = String(getUserId(req));
// //     const { name, date, notes, exercises } = req.body;

// //     const workout = await prisma.workout.create({
// //       data: {
// //         userId,
// //         name: name || 'Workout',
// //         date: date ? new Date(date) : new Date(),
// //         notes: notes || null,
// //         exercises: exercises?.length
// //           ? {
// //               create: exercises.map((e) => ({
// //                 name: e.name,
// //                 sets: e.sets,
// //                 reps: e.reps,
// //                 weight: parseFloat(e.weight) || 0,
// //                 notes: e.notes || null,
// //               })),
// //             }
// //           : undefined,
// //       },
// //       include: { exercises: true },
// //     });

// //     res.status(201).json(workout);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: err.message || 'Failed to add workout' });
// //   }
// // }

// // export async function getWorkouts(req, res) {
// //   try {
// //     const userId = String(getUserId(req));
// //     const { from, to } = req.query;

// //     const where = { userId };

// //     if (from || to) {
// //       where.date = {};
// //       if (from) where.date.gte = new Date(from);
// //       if (to) where.date.lte = new Date(to);
// //     }

// //     const workouts = await prisma.workout.findMany({
// //       where,
// //       include: { exercises: true },
// //       orderBy: { date: 'desc' },
// //     });

// //     res.json(workouts);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: err.message || 'Failed to fetch workouts' });
// //   }
// // }

// // export async function deleteWorkout(req, res) {
// //   try {
// //     const userId = String(getUserId(req));
// //     const { id } = req.params;

// //     await prisma.workout.deleteMany({
// //       where: { id, userId },
// //     });

// //     res.status(204).send();
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: err.message || 'Failed to delete workout' });
// //   }
// // }

// import prisma from '../lib/prisma.js';
// import { getUserId } from '../middleware/user.js';

// export async function addWorkout(req, res) {
//   try {
//     const userId = await getUserId(req);
//     const { name, date, notes, exercises } = req.body;

//     const workout = await prisma.workout.create({
//       data: {
//         userId,
//         name: name || 'Workout',
//         date: date ? new Date(date) : new Date(),
//         notes: notes || null,
//         exercises: exercises?.length
//           ? {
//               create: exercises.map((e) => ({
//                 name: e.name,
//                 sets: e.sets,
//                 reps: e.reps,
//                 weight: parseFloat(e.weight) || 0,
//                 notes: e.notes || null,
//               })),
//             }
//           : undefined,
//       },
//       include: { exercises: true },
//     });

//     res.status(201).json(workout);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Failed to add workout' });
//   }
// }

// export async function getWorkouts(req, res) {
//   try {
//     const userId = await getUserId(req);
//     const { from, to } = req.query;

//     const where = { userId };

//     if (from || to) {
//       where.date = {};
//       if (from) where.date.gte = new Date(from);
//       if (to) where.date.lte = new Date(to);
//     }

//     const workouts = await prisma.workout.findMany({
//       where,
//       include: { exercises: true },
//       orderBy: { date: 'desc' },
//     });

//     res.json(workouts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Failed to fetch workouts' });
//   }
// }

// export async function deleteWorkout(req, res) {
//   try {
//     const userId = await getUserId(req);
//     const { id } = req.params;

//     await prisma.workout.deleteMany({
//       where: { id, userId },
//     });

//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Failed to delete workout' });
//   }
// }

import prisma from '../lib/prisma.js';
import { getUserId } from '../middleware/user.js';

export async function addWorkout(req, res) {
  try {
    const userId = await getUserId(req);

    // ensure user exists (fix foreign key error)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@fittrack.local`,
        name: "Demo User"
      }
    });

    const { name, date, notes, exercises } = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId,
        name: name || 'Workout',
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
        exercises: exercises?.length
          ? {
              create: exercises.map((e) => ({
                name: e.name,
                sets: e.sets,
                reps: e.reps,
                weight: parseFloat(e.weight) || 0,
                notes: e.notes || null,
              })),
            }
          : undefined,
      },
      include: { exercises: true },
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to add workout' });
  }
}

export async function getWorkouts(req, res) {
  try {
    const userId = await getUserId(req);

    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { date: 'desc' },
    });

    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch workouts' });
  }
}

export async function deleteWorkout(req, res) {
  try {
    const userId = await getUserId(req);
    const { id } = req.params;

    await prisma.workout.deleteMany({
      where: { id, userId }
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete workout' });
  }
}