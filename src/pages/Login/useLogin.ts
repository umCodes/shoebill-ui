import { useContext, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { getUser, login } from '../../services/auth.services';
import { AuthContext } from '../../contexts/AuthContext';
import { toaster } from '@/components/ui/toaster';



const useLogin = () => {
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''
    });    
    const [isValid, setIsValid] = useState({
        email: true,
        password: true
    });
    const {setUser} = useContext(AuthContext)


    function handleEmailChange(e: ChangeEvent<HTMLInputElement>){ 
        setForm(prev => ({
                        ...prev,
                        email: e.target.value
                    }))
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) || e.target.value === ''){
            setIsValid(prev => ({...prev, email: true}))
        }else setIsValid(prev => ({...prev, email: false}))

        
    }
    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>){ 
        setForm(prev => ({
                        ...prev,
                        password: e.target.value
                    }))
        if(/^^(?=.*[A-Za-z]).{8,}$/.test(e.target.value) || e.target.value === ''){
            setIsValid(prev => ({...prev, password: true}))
        }else setIsValid(prev => ({...prev, password: false}))

    }

        
    const handleLogin = async () => {
        console.log("heu");
        
        // e.preventDefault();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){
            return  toaster.create({
                            description: "Please enter a valid email.",
                            type: "error",
                        });
        }
        if(!/^^(?=.*[A-Za-z]).{8,}$/.test(form.password)){
            return toaster.create({
                            description: "Please enter a valid password.",
                            type: "error",
                        });;
        }

        setIsLoading(true)
        try {
            const response = await login(form);
            console.log(response);
            setIsLoading(false)
            navigateTo('/');    
            const user = await getUser();
            setUser(user); 
            return;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toaster.create({
                description: (error as {status: number}).status !== 500 ? "Invalid email or password" : "Something went wrong. Please try again later.",
                type: "error",
            });
            
        }

    }
    
  
    return {
        form,
        isValid,
        isLoading,
        handleEmailChange,
        handlePasswordChange,
        handleLogin,
    }
}

export default useLogin