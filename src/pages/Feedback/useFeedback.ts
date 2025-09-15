import { useContext, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { toaster } from "@/components/ui/toaster";

const useFeedback = () => {
    const navigateTo = useNavigate();
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        subject: '',
        message: ''
    })
    const [submiting, setSubmiting] = useState(false);

    async function handleSubmit() {
        if (!user) {
            navigateTo('/signup');
            return;
        }

        if (!form.message || !form.subject)
            return toaster.create({
                description: "Subject and message are required",
                type: "info",
            })

        try {
            setSubmiting(true)
            await axios.post(
                String(import.meta.env.VITE_BASE_API_PATH) + '/api/feedback',
                { ...form, email: user.email },
                { withCredentials: true }
            );

            toaster.create({
                description: "Feedback submitted successfully!",
                type: "success",
            })
            setSubmiting(false)
        } catch (error) {
            console.error(error);
            setSubmiting(false)
            toaster.create({
                description: "Something went wrong. Please try again later.",
                type: "error",
            })
        }
    }

    return {
        handleSubmit,
        setForm,
        form,
        submiting
    }
}

export default useFeedback
