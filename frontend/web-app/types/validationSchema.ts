import * as yup from 'yup';

const validationSchema = yup.object().shape({
    make: yup.string().required('Make is required'),
    model: yup.string().required('Model is required'),
    color: yup.string().required('Color is required'),
    year: yup.number().required('Year is required').positive('Year must be a positive number').integer('Year must be an integer'),
    mileage: yup.number().required('Mileage is required').positive('Mileage must be a positive number').integer('Mileage must be an integer'),
    imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
    reservePrice: yup.number().required('Reserve price is required').min(0, 'Reserve price must be 0 or more'),
    auctionEnd: yup.date().required('Auction end date is required').min(new Date(), 'Auction end date must be in the future')
});
