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

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: usersForView,
        count: usersForView.length
      });
    }

    if (res.render) {
      return res.render("users/list", {
        title: "Quản lý Người dùng",
        users: usersForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: usersForView, count: usersForView.length });
  } catch (err) {
    console.error("Error in getUsers:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy người dùng"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy người dùng", status: 404 });
    }

    const userForView = user
      ? { ...user, _id: user._id?.toString?.() ?? user._id }
      : null;

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: userForView
      });
    }

    if (res.render) {
      return res.render("users/detail", {
        title: "Chi tiết Người dùng",
        user: userForView
      });
    }

    res.json({ success: true, data: userForView });
  } catch (err) {
    console.error("Error in getUserById:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name, email and phone are required",
        status: 400
      });
    }

    const newUser = await userService.createUser(name, email, phone, role);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully"
      });
    }

    res.redirect("/users");
  } catch (err) {
    console.error("Error in createUser:", err);
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const errorMsg = `${field} already exists`;
      
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(400).json({
          success: false,
          error: errorMsg,
          status: 400
        });
      }
      if (res.render) {
        return res.status(400).render("error", {
          title: "Lỗi",
          message: errorMsg
        });
      }
      return res.status(400).json({ success: false, error: errorMsg, status: 400 });
    }

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy người dùng"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy người dùng", status: 404 });
    }

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: updatedUser,
        message: "User updated successfully"
      });
    }

    res.redirect(`/users/${id}`);
  } catch (err) {
    console.error("Error in updateUser:", err);
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const errorMsg = `${field} already exists`;
      
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(400).json({
          success: false,
          error: errorMsg,
          status: 400
        });
      }
      if (res.render) {
        return res.status(400).render("error", {
          title: "Lỗi",
          message: errorMsg
        });
      }
      return res.status(400).json({ success: false, error: errorMsg, status: 400 });
    }

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy người dùng"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy người dùng", status: 404 });
    }

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        message: "User deleted successfully"
      });
    }

    res.redirect("/users");
  } catch (err) {
    console.error("Error in deleteUser:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}
