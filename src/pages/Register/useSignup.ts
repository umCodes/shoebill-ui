import { useContext, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { getUser, signup } from '../../services/auth.services';
import { AuthContext } from '../../contexts/AuthContext';
import { toaster } from '@/components/ui/toaster';



const useSignup = () => {
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPass: '',
    });
    
    
    const [isMatching, setIsMatching] = useState(true);

    const [isValid, setIsValid] = useState({
        
        email: true,
        password: true,
        name: true
    });

    const {setUser} = useContext(AuthContext)
    
    function handleNameChange(e: ChangeEvent<HTMLInputElement>){ 
        setForm(prev => ({
                        ...prev,
                        name: e.target.value
                    }))
        if(e.target.value !== ''){
            setIsValid(prev => ({...prev, name: true}))
        }else setIsValid(prev => ({...prev, name: false}))
        
    }

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

        if(e.target.value === form.confirmPass){
            setIsMatching(true)
        }else setIsMatching(false)


    }
    function handleConfirmPassChange(e: ChangeEvent<HTMLInputElement>){ 
        
        setForm(prev => ({
                        ...prev,
                        confirmPass: e.target.value
            }))

        // if(!/^^(?=.*[A-Za-z]).{8,}$/.test(form.password) || form.password === '') return;

        if((e.target.value === form.password)){
            setIsMatching(true)
        }else setIsMatching(false)

    }

        
    async function handleSignup(e: FormEvent){
        e.preventDefault()
        if (
            !form.name ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
            !/^(?=.*[A-Za-z]).{8,}$/.test(form.password) ||
            !isMatching
        ) {
            return toaster.create({
                description: "Please fill all fields correctly before proceeding.",
                type: "info",
            });
        }

        setIsLoading(true)
        try {
            const response = await signup(form);
            console.log(response);//add popup
            
            setIsLoading(false)
            navigateTo('/')        
            const user = await getUser();
            setUser(user); 
            return;
        } catch (error) {
            console.error(error);
            setIsLoading(false)
            toaster.create({
                description: "Something went wrong. Please try again later.",
                type: "error",
            });
        }
    }
    
  
    return {
        form,
        isValid,
        isLoading,
        isMatching,
        handleNameChange,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPassChange,
        handleSignup,
    }
}

export default useSignup