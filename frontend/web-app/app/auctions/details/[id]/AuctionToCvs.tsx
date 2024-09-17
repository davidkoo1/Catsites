"use client"; // Add this line at the top of your file

import React from 'react';
import { DropdownItem } from 'flowbite-react';
import { FaFileCsv } from 'react-icons/fa';
import { downloadFile } from './downloadFile';

type Props = {
    auctionId: string
}
export default function AuctionToCvs({auctionId}: Props) {
    const handleDownload = async () => {
        
        try {
          await downloadFile(auctionId);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };

    return (
        <DropdownItem icon={FaFileCsv} onClick={handleDownload}>
            Export to CSV
        </DropdownItem>
    );
}
