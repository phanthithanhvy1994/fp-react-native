import ChannelService from '../services/channel.service';

const getAllChannel = body => ChannelService.getAllChannel(body);

export { getAllChannel };
