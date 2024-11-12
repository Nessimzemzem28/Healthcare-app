import React from 'react';
import { BsPersonVcard } from 'react-icons/bs';

const Modal = ({ title, children, onClose, onConfirm, actionType }) => {
  const getConfirmButtonText = () => {
    switch (actionType) {
      case 'delete':
        return 'Delete';
      case 'edit':
        return 'Edit';
      case 'add':
        return 'Add';
      default:
        return 'Confirm';
    }
  };

  const getConfirmButtonClass = () => {
    switch (actionType) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'edit':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'add':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-gray-100 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-center">
            {actionType === 'add' && <BsPersonVcard className="text-4xl text-gray-600 mr-2" />}
            {actionType === 'edit' && <BsPersonVcard className="text-4xl text-gray-600 mr-2" />}
            <h3 className="text-2xl font-bold text-gray-900">
              {title}
            </h3>
          </div>
          <div className="mt-4">
            {children}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-2">
          {(actionType === 'add' || actionType === 'edit') ? (
            <button
              type="button"
              className="btn btn-outline text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline btn-error"
                onClick={onConfirm}
              >
                {getConfirmButtonText()}
              </button>
              <button
                type="button"
                className="btn btn-outline text-gray-800"
                onClick={onClose}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
