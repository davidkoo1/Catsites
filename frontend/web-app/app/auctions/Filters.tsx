import { useParamsStore } from '@/hooks/useParamsStore';
import { Button, ButtonGroup } from 'flowbite-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { BsFillStopCircleFill, BsStopwatch, BsStopwatchFill } from 'react-icons/bs';
import { GiFinishLine, GiFlame } from 'react-icons/gi';


const pageSizeButtons = [4, 8, 12, 16];

const orderButtons = [
    {
        label: 'Alphabetical',
        icon: AiOutlineSortAscending,
        value: 'make'
    },
    {
        label: 'End date',
        icon: AiOutlineClockCircle,
        value: 'endingSoon'
    },
    {
        label: 'Recently added',
        icon: BsFillStopCircleFill,
        value: 'new'
    }
]

const filterButtons = [
    {
        label: 'Live Auctions',
        icon: GiFlame,
        value: 'live'
    },
    {
        label: 'End < 6 hours',
        icon: GiFinishLine,
        value: 'endingSoon'
    },
    {
        label: 'Completed',
        icon: BsStopwatchFill,
        value: 'finished'
    }
]




export default function Filters() {
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);
    const filterBy = useParamsStore(state => state.filterBy);
    const pathname = usePathname();

    return (
        <div className='flex justify-between items-center mb-4'>

            <div>
                <span className='uppercase text-sm text-gray-100 mr-2'>Filter by</span>
                <Button.Group>
                    {filterButtons.map(({ label, icon: Icon, value }) => (
                        <Button
                            key={value}
                            onClick={() => setParams({ filterBy: value })}
                            color={`${filterBy === value ? 'red' : 'white'}`}
                        >
                            <Icon className='mr-3 h-4 w-4' />
                            {label}
                        </Button>

                    ))}
                </Button.Group>
            </div>

            <div>
                <span className='uppercase text-sm text-gray-100 mr-2'>Order by</span>
                <Button.Group>
                    {orderButtons.map(({ label, icon: Icon, value }) => (
                        <Button
                            key={value}
                            onClick={() => setParams({ orderBy: value })}
                            color={`${orderBy === value ? 'red' : 'white'}`}
                        >
                            <Icon className='mr-3 h-4 w-4' />
                            {label}
                        </Button>

                    ))}
                </Button.Group>
            </div>
            {pathname === '/' && (
                <div>
                    <span className='uppercase text-sm text-gray-100 mr-2'>
                        Page size
                    </span>
                    <ButtonGroup>
                        {pageSizeButtons.map((value, i) => (
                            <Button
                                key={i}
                                onClick={() => setParams({ pageSize: value })}
                                color={`${pageSize === value ? 'red' : 'white'}`}
                            //className="no-rounded"
                            >
                                {value}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            )}
        </div>
    )
}
