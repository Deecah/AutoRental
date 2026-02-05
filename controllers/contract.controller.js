import * as contractService from "../services/contract.service.js";

function normalizeContractsForView(contracts) {
  if (!Array.isArray(contracts)) return [];
  return contracts.map((c) => {
    const booking = c.bookingId;
    return {
      ...c,
      _id: c._id?.toString?.() ?? c._id,
      bookingId: booking
        ? {
            ...booking,
            _id: booking._id?.toString?.() ?? booking._id,
            userId: booking.userId
              ? {
                  ...booking.userId,
                  _id: booking.userId._id?.toString?.()
                }
              : null,
            carId: booking.carId
              ? { ...booking.carId, _id: booking.carId._id?.toString?.() }
              : null
          }
        : null
    };
  });
}

export async function getContracts(req, res) {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const contracts = await contractService.getContracts(filter);
    const contractsForView = normalizeContractsForView(contracts);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: contractsForView,
        count: contractsForView.length
      });
    }

    if (res.render) {
      return res.render("contracts/list", {
        title: "Quản lý Hợp đồng",
        contracts: contractsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: contractsForView, count: contractsForView.length });
  } catch (err) {
    console.error("Error in getContracts:", err);
    
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

export async function getContractById(req, res) {
  try {
    const { id } = req.params;
    const contract = await contractService.getContractById(id);
    
    if (!contract) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy hợp đồng",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy hợp đồng"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy hợp đồng", status: 404 });
    }

    const contractForView = contract
      ? normalizeContractsForView([contract])[0] || contract
      : null;

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: contractForView
      });
    }

    if (res.render) {
      return res.render("contracts/detail", {
        title: "Chi tiết Hợp đồng",
        contract: contractForView
      });
    }

    res.json({ success: true, data: contractForView });
  } catch (err) {
    console.error("Error in getContractById:", err);
    
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

export async function createContract(req, res) {
  try {
    const { bookingId, totalCost } = req.body;

    if (!bookingId || !totalCost) {
      return res.status(400).json({
        success: false,
        error: "bookingId and totalCost are required",
        status: 400
      });
    }

    const newContract = await contractService.createContract(bookingId, totalCost);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(201).json({
        success: true,
        data: newContract,
        message: "Contract created successfully"
      });
    }

    res.redirect("/contracts");
  } catch (err) {
    console.error("Error in createContract:", err);
    
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
