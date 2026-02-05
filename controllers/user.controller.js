import * as userService from "../services/user.service.js";

function normalizeUsersForView(users) {
  if (!Array.isArray(users)) return [];
  return users.map((u) => ({
    ...u,
    _id: u._id?.toString?.() ?? u._id
  }));
}

export async function getUsers(req, res) {
  try {
    const { name, email, phone } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (phone) filter.phone = phone;

    const users = await userService.getUsers(filter);
    const usersForView = normalizeUsersForView(users);

    res.render("users/list", {
      title: "Quản lý Người dùng",
      users: usersForView,
      query: req.query || {}
    });
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy người dùng"
      });
    }

    const userForView = user
      ? { ...user, _id: user._id?.toString?.() ?? user._id }
      : null;

    res.render("users/detail", {
      title: "Chi tiết Người dùng",
      user: userForView
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).render("error", {
        title: "Lỗi",
        message: "Name, email and phone are required"
      });
    }

    await userService.createUser(name, email, phone, role);
    res.redirect("/users");
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).render("error", {
        title: "Lỗi",
        message: `${field} already exists`
      });
    }
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy người dùng"
      });
    }

    res.redirect(`/users/${id}`);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).render("error", {
        title: "Lỗi",
        message: `${field} already exists`
      });
    }
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy người dùng"
      });
    }

    res.redirect("/users");
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}
