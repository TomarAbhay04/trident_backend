// src/controllers/dashboardController.js
import User from "../models/User.js";
import Policy from "../models/Policy.js";
import PolicyCategory from "../models/PolicyCategory.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // ---- Helpers ----
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };
    const addMonths = (d, months) => {
      const copy = new Date(d);
      copy.setMonth(copy.getMonth() + months);
      return copy;
    };

    const today = startOfDay(now);

    // Week: assume current week = today -> today + 7 days
    const startOfWeek = today;
    const endOfWeek = addDays(startOfWeek, 7);

    const monthStart = startOfMonth(now);
    const nextMonthStart = addMonths(monthStart, 1);
    const twoMonthsLaterStart = addMonths(monthStart, 2);

    // ---- Basic counts ----
    const [totalUsers, totalCategories, totalPolicies] = await Promise.all([
      User.countDocuments(),
      PolicyCategory.countDocuments(),
      Policy.countDocuments(),
    ]);

    // ---- Policies started in ranges (startDate) ----
    const [policiesThisWeek, policiesThisMonth, policiesNextTwoMonths] =
      await Promise.all([
        Policy.countDocuments({
          startDate: { $gte: startOfWeek, $lt: endOfWeek },
        }),
        Policy.countDocuments({
          startDate: { $gte: monthStart, $lt: nextMonthStart },
        }),
        Policy.countDocuments({
          startDate: { $gte: nextMonthStart, $lt: twoMonthsLaterStart },
        }),
      ]);

    // ---- Expiring policies (endDate) + populated for listing ----
    const [nextWeekExpiring, currentMonthExpiring, nextTwoMonthsExpiring] =
      await Promise.all([
        Policy.find({
          endDate: { $gte: today, $lt: addDays(today, 7) },
        })
          .populate("user", "name email")
          .populate("category", "name")
          .sort({ endDate: 1 }),

        Policy.find({
          endDate: { $gte: monthStart, $lt: nextMonthStart },
        })
          .populate("user", "name email")
          .populate("category", "name")
          .sort({ endDate: 1 }),

        Policy.find({
          endDate: { $gte: nextMonthStart, $lt: twoMonthsLaterStart },
        })
          .populate("user", "name email")
          .populate("category", "name")
          .sort({ endDate: 1 }),
      ]);

    res.json({
      totalUsers,
      totalCategories,
      totalPolicies,

      policiesThisWeek,
      policiesThisMonth,
      policiesNextTwoMonths,

      nextWeekExpiring,
      currentMonthExpiring,
      nextTwoMonthsExpiring,
    });
  } catch (err) {
    next(err);
  }
};
