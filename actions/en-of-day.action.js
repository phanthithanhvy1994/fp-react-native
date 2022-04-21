import EndOfDay from '../services/end-of-day.service';

const getMaterialConsumptionTable = body =>
  EndOfDay.getMaterialConsumptionTable(body);

const submitMaterialConsumption = body =>
  EndOfDay.submitMaterialConsumption(body);

const getEODRevenueTable = body =>
  EndOfDay.getEODRevenueTable(body);

const submitEODRevenue = body =>
  EndOfDay.submitEODRevenue(body);

export { getMaterialConsumptionTable, submitMaterialConsumption, getEODRevenueTable, submitEODRevenue };
