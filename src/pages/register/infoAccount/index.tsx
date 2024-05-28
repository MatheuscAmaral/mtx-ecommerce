import logo from "../../../assets/rwalogo2.png"
import { FaEyeSlash, FaEye } from "react-icons/fa";

import * as React from 'react';

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, useParams, useNavigate } from "react-router-dom";

import { useState } from "react";

import { Input } from '@/components/ui/input';

import { FaAddressCard } from "react-icons/fa";
import { FaUserSecret } from "react-icons/fa6";

import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { BiStreetView } from "react-icons/bi";
import { GoNumber } from "react-icons/go";
import { TbPasswordFingerprint, TbLocationPlus } from "react-icons/tb";
import { GiVillage, GiModernCity } from "react-icons/gi";
import { MdOutlineShareLocation, MdDriveFileRenameOutline } from "react-icons/md";
import cepApi from "@/api/cep";
import toast from "react-hot-toast";

import { FaSearch } from "react-icons/fa";
import { api } from "@/api";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
    backgroundColor:
        'rgb(8, 48, 230)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
        backgroundColor:
        'rgb(8, 48, 230)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor:
        'rgb(8, 48, 230)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor:
      'rgb(8, 48, 230)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <FaUserSecret fontSize={18}/>,
    2: <FaAddressCard fontSize={18}/>,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Cadastro', 'Informações adicionais'];

interface CepProps {
    cepInput: string
}

export function InfoAccount() {
    const [step, setStep] = useState(Number);
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState("");
    const [date, setDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [cep, setCep] = useState("");
    const [street, setStreet] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [complement, setComplement] = useState("");
    const [number, setNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const { cpf, email } = useParams();

    const navigate = useNavigate();

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cepInput = e.target.value;

        setCep(cepInput);

        verifyCep({cepInput});
    }


    async function verifyCep(cepInput: CepProps) {
        if(cepInput.cepInput.length != 8 && cepInput.cepInput.length != 0) {
            return;
        }

        if(cepInput.cepInput.length == 0) {
            setStreet("");
            setNeighborhood("");
            setCity("");
            setState("");
            setNumber("");
            setComplement("");

            return;
        }

        try {
            const response = await cepApi.get(`/${cepInput.cepInput}`);

            setStreet(response.data.logradouro);
            setNeighborhood(response.data.bairro);
            setComplement(response.data.complemento);
            setCity(response.data.localidade);
            setState(response.data.uf);
        }

        catch {
            toast.error("Opss, ocorreu um erro ao buscar o cep!");
        }  
    }


    async function verifySectionInfo (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        
        if(password != confirmPass)  {
            toast.error("As senhas digitadas não coincidem!");
            setError(true);
            setLoading(false);
            return;
        }
        
        if(password.length < 6) {
            toast.error("As senhas devem ter no mínimo 6 dígitos!");
            setError(true);
            setLoading(false);
            return;

        }
        
        setLoading(false);
        setStep((step) => step + 1); 
        setError(false);
        
        
        if(step > 0) {
            try {
               setLoading(true);
                await api.post("/users/register", {
                    name: nome,
                    cpf: cpf,
                    email: email,   
                    date: date,
                    password: password,
                    cep: cep,
                    rua: street,
                    numero: number,
                    bairro: neighborhood,
                    cidade: city,
                    uf: state,
                    status: 1,
                });


                toast.success("Usuário cadastrado com sucesso!")
                navigate("/login");
           }

           catch (error: any) {
                const errors = error.response.data.errors;
                
                if(!errors) {
                    return toast.error("Ocorreu um erro ao verificar o cadastro!");
                }

                if(errors.cpf) {
                    return toast.error(error.response.data.errors.cpf)
                } 
                
                if (errors.email) {
                    return toast.error(error.response.data.errors.email);
                }
            }

            finally {
                setLoading(false);
            }
        }
    }

    return (
            <div className="flex flex-col justify-center mx-auto items-center mt-10 mb-10">
                <Link to={"/"}>
                    <img src={logo} alt="logo" className="w-16"/>            
                </Link>

                <Stack spacing={4} className="w-full max-w-7xl mt-10">
                    <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                            <Step key={label} onClick={() => step == 1 && setStep(step - 1)}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>
                                    <p className="text-xs font-sans font-semibold ">{label}</p>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Stack>

                    <form onSubmit={(e) => verifySectionInfo(e)} className="flex flex-col gap-7 w-full max-w-3xl mt-16 px-10">
                        { 
                            step == 0 ?  (
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                    <div className='w-full text-sm text-gray-600 relative'>
                                        <label htmlFor="date" className='ml-1'>Nome completo *</label>
                                        <Input  value={nome} onChange={(e) => setNome(e.target.value)} placeholder='Digite seu nome completo' type='text' id='user' className='text-xs mt-2' required/>
                                        <MdDriveFileRenameOutline fontSize={18} className="absolute top-10 right-3 "/>
                                    </div>

                                    <div className='w-full text-sm text-gray-600 relative'>
                                        <label htmlFor="user" className='ml-1'>Data de nascimento *</label>
                                        <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder='Digite sua data de nascimento' type='date' id='date' className='text-xs mt-2 w-full' required/>
                                    </div>

                                    <div className='w-full text-sm text-gray-600 relative'>
                                        <label htmlFor="password" className='ml-1'>Senha *</label>
                                        <Input value={password} onChange={(e) => setPassword(e.target.value)}  placeholder='Digite sua senha' type={showPassword ? 'text': 'password'} id='password' className={`text-xs mt-2 transition-all ${error ? "border-red-500" : ""}`} required/>
                                        {
                                            password.length <= 0 ? (
                                                <TbPasswordFingerprint fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                            ) : (
                                                showPassword ? (
                                                    <FaEye onClick={() => setShowPassword(false)} fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                                ) : (
                                                    <FaEyeSlash onClick={() => setShowPassword(true)} fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                                )
                                            )
                                        }
                                    </div>

                                    <div className='w-full text-sm text-gray-600 relative'>
                                        <label htmlFor="password" className='ml-1'>Confirmar senha *</label>
                                        <Input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}  placeholder='Digite sua senha novamente' type={showPassword ? 'text': 'password'} id='password' className={`text-xs mt-2 transition-all ${error ? "border-red-500" : ""}`} required/>
                                        {
                                            confirmPass.length <= 0 ? (
                                                <TbPasswordFingerprint fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                            ) : (
                                                showPassword ? (
                                                    <FaEye onClick={() => setShowPassword(false)} fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                                ) : (
                                                    <FaEyeSlash onClick={() => setShowPassword(true)} fontSize={18} className="absolute top-10 right-3 transition-all "/>
                                                )
                                            )
                                        }
                                    </div>
                                </section>
                            ) : (
                                <>
                                    <div className='w-full text-sm text-gray-600 relative'>
                                        <label htmlFor="cep" className='ml-1'>CEP *</label>
                                        <Input minLength={1} value={cep}  onChange={handleCepChange}
                                            placeholder='Digite o cep' type='number' id='cep' className='text-xs mt-2' 
                                            required
                                        />
                                        <FaSearch className="absolute top-10 right-3 "/>
                                    </div>

                                                           
                                       {
                                            <section className={`grid grid-cols-1 md:grid-cols-2 gap-7 ${cep.length != 8 ? "opacity-70" : "" }`}>
                                                <div className='w-full text-sm text-gray-600 relative'>
                                                    <label htmlFor="rua" className='ml-1'>Rua *</label>
                                                    <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder='Digite o nome da sua rua' type='text' id='rua' readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? " opacity-80 cursor-not-allowed bg-gray-200" : ""}`} required/>
                                                    <BiStreetView fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>

                                                <div className='w-full text-sm text-gray-600 relative'>
                                                    <label htmlFor="number" className='ml-1'>Número *</label>
                                                    <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder='Digite o número da residência' type='number' id='number' readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? " opacity-80 cursor-not-allowed bg-gray-200" : ""}`} required/>
                                                    <GoNumber fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>

                                                <div className='w-full text-sm text-gray-600 relative'>
                                                    <label htmlFor="bairro" className='ml-1'>Bairro *</label>
                                                    <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder='Digite o nome do bairro' type='text' id='bairro' readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? " opacity-80 cursor-not-allowed bg-gray-200" : ""}`} required/>
                                                    <GiVillage fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>

                                                <div className='w-full text-sm text-gray-600 relative'>
                                                    <label htmlFor="complement" className='ml-1'>Complemento</label>
                                                    <Input value={complement} onChange={(e) => setComplement(e.target.value)} placeholder='Digite o complemento' type='text' id='complement' readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? " opacity-80 cursor-not-allowed bg-gray-200" : ""}`} />
                                                    <TbLocationPlus fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>

                                                <div className={"w-full text-sm text-gray-600 relative"}>
                                                    <label htmlFor="cidade" className='ml-1'>Cidade *</label>
                                                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder='Digite o nome da cidade' type='text' id='cidade'  readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? " cursor-not-allowed bg-gray-200" : ""}`} required/>
                                                    <GiModernCity fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>

                                                <div className='w-full text-sm text-gray-600 relative'>
                                                    <label htmlFor="estado" className='ml-1'>Estado *</label>
                                                    <Input value={state} onChange={(e) => setState(e.target.value)} placeholder='Digite o nome do estado' type='text' id='estado'  readOnly={cep.length != 8} className={`text-xs mt-2 ${cep.length != 8 ? "  cursor-not-allowed bg-gray-200" : ""}`} required/>
                                                    <MdOutlineShareLocation fontSize={18} className="absolute top-10 right-3 "/>
                                                </div>
                                            </section> 
                                       }
                                </>
                        )
                    }
                    
                    <button id='button' className={`${loading ? "disabled cursor-not-allowed opacity-70" : ""} text-sm bg-[#159bf5] text-white flex items-center justify-center py-3 w-full rounded-lg border-0`}>
                        {
                            loading ? (
                                <AiOutlineLoading3Quarters fontSize={22} className=' transition-all animate-spin'/>
                                ) : (
                                    <p style={{paddingBottom: 2}} className='transition-all'>
                                        {
                                            step > 1 ? "Cadastrar" : "Próximo"
                                        }
                                    </p>      
                                )
                        }
                    </button>
                </form>
            </div>
    );
}
