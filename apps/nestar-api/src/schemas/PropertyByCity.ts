import { Schema } from 'mongoose';
import { PropertyLocation } from '../libs/enums/property.enum';

const PropertyByCity = new Schema({
	cityName: {
		type: PropertyLocation,
		required: true,
	},

	cityImage: {
		type: String,
		required: true,
	},

	cityPropertiesRefId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
});
