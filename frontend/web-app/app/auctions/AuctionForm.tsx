'use client';

import { TextInput, Button } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/auctionActions';
import toast from 'react-hot-toast';
import { Auction } from '@/types';

type Props = {
    auction?: Auction
};

export default function AuctionForm({ auction }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { control, handleSubmit, setFocus, reset, setError, clearErrors, getValues, formState: { isSubmitting, isValid, errors } } = useForm({
        mode: 'onChange'
    });


    const [makeErrors, setMakeErrors] = useState<string[]>([]);
    const [modelErrors, setModelErrors] = useState<string[]>([]);
    const [colorErrors, setColorErrors] = useState<string[]>([]);
    const [mileageErrors, setMileageErrors] = useState<string[]>([]);
    const [yearErrors, setYearErrors] = useState<string[]>([]);
    const [imageUrlErrors, setImageUrlErrors] = useState<string[]>([]);
    const [reservePriceErrors, setReservePriceErrors] = useState<string[]>([]);
    const [auctionEndErrors, setAuctionEndErrors] = useState<string[]>([]);

    useEffect(() => {
        if (auction) {
            const { make, model, color, mileage, year, imageUrl, reservePrice, auctionEnd } = auction;
            reset({ make, model, color, mileage, year, imageUrl, reservePrice, auctionEnd });
        }
        setFocus('make');
    }, [setFocus, auction, reset]);

    // Кастомная валидация для поля "make"
    const validateMake = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Make is required');
        }
        if (value.length <= 1) {
            errors.push('Make must be longer than 1 characters');
        }


        setMakeErrors(errors);

        if (errors.length > 0) {
            setError('make', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "model"
    const validateModel = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Model is required');
        }
        if (value.length <= 1) {
            errors.push('Model must be longer than 1 characters');
        }

        setModelErrors(errors);

        if (errors.length > 0) {
            setError('model', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "color"
    const validateColor = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Color is required');
        }

        setColorErrors(errors);

        if (errors.length > 0) {
            setError('color', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "mileage"
    const validateMileage = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Mileage is required');
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
            errors.push('Mileage must be a positive number');
        }

        setMileageErrors(errors);

        if (errors.length > 0) {
            setError('mileage', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "year"
    const validateYear = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Year is required');
        }
        const currentYear = new Date().getFullYear();
        if (isNaN(Number(value)) || Number(value) < 1700 || Number(value) > currentYear) {
            errors.push(`Year must be between 1700 and ${currentYear}`);
        }

        setYearErrors(errors);

        if (errors.length > 0) {
            setError('year', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "imageUrl"
    const validateImageUrl = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Image URL is required');
        }
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/;
        if (!urlPattern.test(value)) {
            errors.push('Invalid URL format');
        }

        setImageUrlErrors(errors);

        if (errors.length > 0) {
            setError('imageUrl', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "reservePrice"
    const validateReservePrice = (value: string) => {
        const errors: string[] = [];


        if (value && (isNaN(Number(value)) || Number(value) <= 0) && value.trim()) {
            errors.push('Reserve price must be a positive number');
        }

        setReservePriceErrors(errors);

        if (errors.length > 0) {
            setError('reservePrice', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    // Кастомная валидация для поля "auctionEnd"
    const validateAuctionEnd = (value: string) => {
        const errors: string[] = [];

        if (!value || !value.trim()) {
            errors.push('Auction end date is required');
        }
        const currentDate = new Date();
        const auctionEndDate = new Date(value);
        if (auctionEndDate <= currentDate) {
            errors.push('Auction end date must be in the future');
        }

        setAuctionEndErrors(errors);

        if (errors.length > 0) {
            setError('auctionEnd', { type: 'manual', message: errors.join('\n') });
            return false;
        }

        return true;
    };

    const handleFocus = (field: string) => {
        const currentFieldValue = getValues(field); // Получаем текущее значение поля

        // Вызываем соответствующую функцию валидации только если значение не пустое
        if (field === 'make') validateMake(currentFieldValue);
        if (field === 'model') validateModel(currentFieldValue);
        if (field === 'color') validateColor(currentFieldValue);
        if (field === 'mileage') validateMileage(currentFieldValue);
        if (field === 'year') validateYear(currentFieldValue);
        if (field === 'imageUrl') validateImageUrl(currentFieldValue);
        if (field === 'reservePrice') validateReservePrice(currentFieldValue);
        if (field === 'auctionEnd') validateAuctionEnd(currentFieldValue);
    };


    async function onSubmit(data: FieldValues) {
        try {
            let id = '';
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data);
                id = res.id;
            } else {
                if (auction) {
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                }
            }

            if (res.error) {
                throw res.error;
            }
            router.push(`/auctions/details/${id}`);
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message);
        }
    }

    return (
        <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
            <Input
                label='Make'
                name='make'
                control={control}
                onFocus={() => handleFocus('make')}
                rules={{ validate: validateMake }}
            />
            {makeErrors.length > 0 && (
                <div className="text-red-500 text-sm mb-3">
                    {makeErrors.map((error, index) => (
                        <p key={index}>*{error}</p>
                    ))}
                </div>
            )}
            <Input
                label='Model'
                name='model'
                control={control}
                onFocus={() => handleFocus('model')}
                rules={{ validate: validateModel }}
            />
            {modelErrors.length > 0 && (
                <div className="text-red-500 text-sm mb-3">
                    {modelErrors.map((error, index) => (
                        <p key={index}>*{error}</p>
                    ))}
                </div>
            )}

            <Input
                label='Color'
                name='color'
                control={control}
                onFocus={() => handleFocus('color')}
                rules={{ validate: validateColor }}
            />
            {colorErrors.length > 0 && (
                <div className="text-red-500 text-sm mb-3">
                    {colorErrors.map((error, index) => (
                        <p key={index}>*{error}</p>
                    ))}
                </div>
            )}
            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Year"
                    name="year"
                    type="number"
                    control={control}
                    onFocus={() => handleFocus("year")}
                    rules={{ validate: validateYear }}
                />
                <Input
                    label="Mileage"
                    name="mileage"
                    type="number"
                    control={control}
                    onFocus={() => handleFocus("mileage")}
                    rules={{ validate: validateMileage }}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {yearErrors.length > 0 ? (
                    <div className="text-red-500 text-sm mb-3">
                        {yearErrors.map((error, index) => (
                            <p key={index}>*{error}</p>
                        ))}
                    </div>
                ) : (
                    <div />
                )}

                {mileageErrors.length > 0 ? (
                    <div className="text-red-500 text-sm mb-3">
                        {mileageErrors.map((error, index) => (
                            <p key={index}>*{error}</p>
                        ))}
                    </div>
                ) : (
                    <div />
                )}
            </div>

            {pathname === '/auctions/create' &&
                <>
                    <Input
                        label='Image URL'
                        name='imageUrl'
                        control={control}
                        onFocus={() => handleFocus('imageUrl')}
                        rules={{ validate: validateImageUrl }}
                    />
                    {imageUrlErrors.length > 0 && (
                        <div className="text-red-500 text-sm mb-3">
                            {imageUrlErrors.map((error, index) => (
                                <p key={index}>*{error}</p>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Input label='Reserve price (leave blank for no reserve)'
                            name='reservePrice'
                            type='number'
                            control={control}
                            onFocus={() => handleFocus('reservePrice')}
                            rules={{ validate: validateReservePrice }} />

                        <DateInput
                            label="Auction End Date"
                            name="auctionEnd"
                            control={control}
                            dateFormat="yyyy-MM-dd HH:mm"
                            showTimeSelect
                            onFocus={() => handleFocus('auctionEnd')}
                            rules={{ validate: validateAuctionEnd }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {reservePriceErrors.length > 0 ? (
                            <div className="text-red-500 text-sm mb-3">
                                {reservePriceErrors.map((error, index) => (
                                    <p key={index}>*{error}</p>
                                ))}
                            </div>
                        ) : (
                            <div />
                        )}

                        {auctionEndErrors.length > 0 ? (
                            <div className="text-red-500 text-sm mb-3">
                                {auctionEndErrors.map((error, index) => (
                                    <p key={index}>*{error}</p>
                                ))}
                            </div>
                        ) : (
                            <div />
                        )}
                    </div>

                </>}


            <div className="flex justify-between">
                <Button outline color='gray'>Cancel</Button>
                <Button
                    isProcessing={isSubmitting}
                    disabled={!isValid}
                    outline
                    color='success'
                    type="submit">Submit</Button>
            </div>
        </form>
    );
}

