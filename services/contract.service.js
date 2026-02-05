import Contract from "../models/contract.model.js";

export async function getContracts(filter) {
  const contracts = await Contract.find(filter)
    .populate({
      path: "bookingId",
      populate: [
        { path: "userId", select: "name email phone" },
        { path: "carId", select: "name pricePerDay" }
      ]
    })
    .lean();
  return Array.isArray(contracts) ? contracts : [];
}

export async function getContractById(contractId) {
  const contract = await Contract.findById(contractId)
    .populate({
      path: "bookingId",
      populate: [
        { path: "userId", select: "name email phone" },
        { path: "carId", select: "name pricePerDay" }
      ]
    })
    .lean();
  return contract;
}

export async function createContract(bookingId, totalCost) {
  return await Contract.create({
    bookingId,
    totalCost: Number(totalCost)
  });
}
