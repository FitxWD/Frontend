import { motion } from "framer-motion";

interface EditableSectionProps {
    title: string;
    children: React.ReactNode;
}

const EditableSection: React.FC<EditableSectionProps> = ({ title, children }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bg-gray-800/80 p-6 rounded-xl border border-gray-700/50"
    >
        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
        {children}
    </motion.div>
);

export default EditableSection;