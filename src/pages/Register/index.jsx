import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //Função para registrar novo usuário
  async function handleRegister(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success("Email cadastrado com sucesso!");
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.log(`Erro: ${error}`);
          toast.warn("Ops. Algo deu errado!");
        });
    } else {
      toast.error("Preencha todos os campos");
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-900">
      <h1 className="text-center text-5xl text-white">Cadastre-se</h1>
      <p className="my-2 text-center text-white">
        Crie sua conta gratuitamente
      </p>

      <div className="flex h-48 w-full max-w-lg flex-col items-center justify-center rounded-lg">
        <form className="flex w-[90%] flex-col gap-3" onSubmit={handleRegister}>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 h-9 rounded-sm border-0 bg-white text-zinc-600 placeholder:px-3 placeholder:text-zinc-500"
          />

          <input
            type="text"
            name="password"
            id="password"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 h-9 rounded-sm border-0 bg-white text-zinc-600 placeholder:px-3 placeholder:text-zinc-500"
          />

          <button className="h-9 cursor-pointer rounded-sm bg-blue-700 text-lg text-white transition-all hover:bg-blue-800">
            Cadastrar
          </button>
        </form>
      </div>

      <Link
        to="/"
        className="btn-link text-base text-white transition-all hover:scale-105"
      >
        Já possui uma conta? Faça login
      </Link>
    </div>
  );
}
