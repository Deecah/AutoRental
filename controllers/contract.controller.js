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

    res.render("contracts/list", {
      title: "Quản lý Hợp đồng",
      contracts: contractsForView,
      query: req.query || {}
    });
  } catch (err) {
    console.error("Error in getContracts:", err);
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function getContractById(req, res) {
  try {
    const { id } = req.params;
    const contract = await contractService.getContractById(id);
    
    if (!contract) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy hợp đồng"
      });
    }

    const contractForView = contract
      ? normalizeContractsForView([contract])[0] || contract
      : null;

    res.render("contracts/detail", {
      title: "Chi tiết Hợp đồng",
      contract: contractForView
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function createContract(req, res) {
  try {
    const { bookingId, totalCost } = req.body;
    await contractService.createContract(bookingId, totalCost);
    res.redirect("/contracts");
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}
