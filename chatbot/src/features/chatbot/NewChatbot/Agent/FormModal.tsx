import Form from "../../../../assets/Images/Form.png";
import { Link } from "react-router-dom";

interface FormProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const FormPopup = ({ isOpen, onClose, onConfirm }: FormProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center max-h-[94vh] overflow-auto">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900">
                    Do you Want to Customize Ticket Request Form?
                </h2>
                <div className="flex justify-center my-4">
                    <img src={Form} alt="Form Illustration" className="w-40 h-auto" />
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <Link to={'/playground'}>
                        <button
                            className="px-6 py-2 bg-purple-100 text-purple-600 font-semibold rounded-lg hover:bg-purple-200"
                            onClick={onClose}
                        >
                            No
                        </button>
                    </Link>
                    <button
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );

};

export default FormPopup;
