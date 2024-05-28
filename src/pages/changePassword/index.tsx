import React, { useContext, useState } from "react";
import Container from "@/components/container";
import Menu from "@/components/menu";

import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";
import { api } from "@/api";
import { AuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const changePass = async (e: React.FormEvent) => {
    e.preventDefault();

    if(password == oldPassword) {
        setError(true);
        return toast.error("A nova senha não pode ser igual a senha atual!");
    }

    if(password.length < 6) {
        setError(true);
        return toast.error("A nova senha não pode conter menos de 6 digítos!");
    }

    const data = {
        password: password
    }

    try {
        setLoading(true);
        await api.put(`/users/password/${user[0].id}/${oldPassword}`, data);

        setOldPassword("");
        setPassword("");
        toast.success("Senha atualizada com sucesso!");
        navigate("/conta");
        setError(false);
    }

    catch (error: any){
        const errors = error.response.data.error;
        setError(true);
        
        if(errors) {
            toast.error(errors);
            return;
        }

        toast.error("Ocorreu um erro ao alterar a senha do usuário!");
    }

    finally {
        setLoading(false);
    }

  }

  return (
    <main className="h-svh select-none transition-all w-full">
      <Container>
        <div className="flex flex-col xl:flex-row w-full justify-center gap-3 xl:mt-10">
          <Menu />

          <div className="border border-gray-100 p-6 rounded-lg w-full">
            <h1 className="text-2xl font-semibold text-gray-700">
              Alterar senha
            </h1>

            <form onSubmit={(e) => changePass(e)} className="flex flex-col justify-start gap-5 mt-8 mb-20 w-full xl:max-w-96">
              <div className="flex flex-col gap-1 relative">
                <span className="text-sm text-gray-500">Senha atual:</span>
                <input
                  onChange={(e) => setOldPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  className={`border w-full rounded-sm text-xs py-2 pl-2 ${error ? "border-red-500" : "border-gray-100"}`}
                  placeholder="Digite a sua antiga senha"
                  required
                />

                <IoEyeSharp onClick={() => setShowPassword(false)} className={`${showPassword ? "block" : "hidden"} absolute right-2 top-8`}/>
                <FaEyeSlash onClick={() => setShowPassword(true)} className={`${showPassword ? "hidden" : "block"} absolute right-2 top-8`}/>
              </div>

              <div className="flex flex-col gap-1 relative">
                <span className="text-sm text-gray-500">Nova senha:</span>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className={`border  w-full rounded-sm text-xs py-2 pl-2 ${error ? "border-red-500" : "border-gray-100"}`}
                  placeholder="Digite a sua antiga senha"
                  required
                />

                <IoEyeSharp onClick={() => setShowPassword(false)} className={`${showPassword ? "block" : "hidden"} absolute right-2 top-8`}/>
                <FaEyeSlash onClick={() => setShowPassword(true)} className={`${showPassword ? "hidden" : "block"} absolute right-2 top-8`}/>
              </div>

              <button
                id="button"
                type="submit"
                className={`${
                  loading ? "disabled cursor-not-allowed opacity-70" : ""
                } text-xs bg-blue-800 text-white flex items-center justify-center py-1.5 w-full rounded-md border-0 hover:bg-blue-700 transition-all mt-2 mb-3`}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters
                    fontSize={22}
                    className=" transition-all animate-spin"
                  />
                ) : (
                  <p
                    style={{ paddingBottom: 2 }}
                    className="transition-all flex items-center gap-2"
                  >
                    <TiEdit fontSize={22} />
                    Alterar senha
                  </p>
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ChangePassword;
