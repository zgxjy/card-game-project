import React, { useState, useEffect } from 'react';
import { PrintConfigProvider, PrintConfigurator } from '../components/PrintConfig';
import { PrintPreview } from '../components/PrintPreview';
import { PDFExporter } from '../components/PDFExporter';
import { toast } from 'react-hot-toast';

export default function PrintPage() {
  const [cards, setCards] = useState([]);
  
  useEffect(() => {
    const loadCards = async () => {
      try {
        const cardsData = sessionStorage.getItem('printCards');
        const parsedData = cardsData ? JSON.parse(cardsData) : [];
        setCards(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error loading cards:', error);
        setCards([]);
        toast.error('加载卡片数据失败');
      }
    };
    
    loadCards();
  }, []);

  const handleExport = () => {
    if (cards.length === 0) {
      toast.error('没有可导出的卡片');
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          resolve();
        } catch (error) {
          console.error('Export failed:', error);
          reject(error);
        }
      }),
      {
        loading: '正在导出PDF...',
        success: 'PDF导出成功',
        error: 'PDF导出失败'
      }
    );
  };

  return (
    <PrintConfigProvider>
      <div className="print-page min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <PrintConfigurator />
            </div>
            
            <div className="col-span-8">
              {cards.length > 0 ? (
                <PrintPreview cards={cards} />
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
                  <p className="text-gray-500">没有可打印的卡片</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <PDFExporter 
          onExport={handleExport}
          cards={cards}
        />
        
        <style>
          {`
            @media print {
              .print-page {
                background: white;
              }
              .col-span-4,
              .pdf-exporter {
                display: none;
              }
              .col-span-8 {
                width: 100%;
                grid-column: span 12;
              }
              .print-preview {
                margin: 0;
                padding: 0;
              }
            }
          `}
        </style>
      </div>
    </PrintConfigProvider>
  );
}