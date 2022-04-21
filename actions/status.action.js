// import StatusService from '../services/status.service';

const sampleStatus = [
  {
    display: 'Status 1',
    value: 'status1',
  },
  {
    display: 'Status 2',
    value: 'status2',
  },
  {
    display: 'Status 3',
    value: 'status3',
  },
];

const getAllStatus = (body) =>
  // return StatusService.getAllStatus(body);
  Promise.resolve({
    statis: 200,
    data: {
      statusList: sampleStatus,
      total: sampleStatus.length,
    },
  });

export { getAllStatus };
