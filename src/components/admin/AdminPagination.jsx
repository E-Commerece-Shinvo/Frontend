import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdminPagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalItems = 0, 
    itemsPerPage = 10, 
    itemName = "items" 
}) => {
    if (totalPages <= 0) return null;

    const getPageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-6 px-6 md:px-8 border-t border-gray-100 mt-auto">
            <div className="text-[13px] font-medium text-gray-500">
                Showing <span className="text-gray-900 font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to <span className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> {itemName}
            </div>
            
            {totalPages > 1 && (
                <div className="flex flex-nowrap items-center justify-center gap-1 md:gap-1.5 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 shrink-0"
                    >
                        <FiChevronLeft className="text-lg" />
                    </button>

                    {getPageNumbers().map((num, idx) => {
                        if (num === '...') {
                            return <span key={`ellipsis-${idx}`} className="text-gray-400 text-xs tracking-wider mx-0.5 md:mx-1 shrink-0">...</span>;
                        }
                        return (
                            <button
                                key={num}
                                onClick={() => onPageChange(num)}
                                className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full font-bold text-[10px] md:text-xs transition-all shrink-0 ${currentPage === num ? 'bg-gradient-to-r from-[#001B1B] to-[#006060] text-white shadow-xl shadow-black/20 z-10' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {num}
                            </button>
                        );
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 shrink-0"
                    >
                        <FiChevronRight className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPagination;
