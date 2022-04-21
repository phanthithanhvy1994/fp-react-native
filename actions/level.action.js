import LevelService from '../services/level.service';

const getAllLevel = (body) => LevelService.getAllLevel(body);

export { getAllLevel };
