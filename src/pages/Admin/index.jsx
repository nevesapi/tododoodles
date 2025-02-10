import { useEffect, useState } from "react";

import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { toast } from "react-toastify";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { MdTaskAlt } from "react-icons/md";
import { CiSaveDown2 } from "react-icons/ci";

export default function Admin() {
  const [taskInput, setTaskInput] = useState("");
  const [user, setUser] = useState({});
  const [editTask, setEditTask] = useState({});

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);
        const tarefaRef = collection(db, "tasks");

        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid),
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().task,
              userUid: doc.data().userUid,
              created: doc.data().created,
            });
          });

          console.log(lista);
          setTarefas(lista);
        });
      }
    }

    loadTarefas();
  }, []);

  //Registrando uma task
  async function handleRegisterTask(e) {
    e.preventDefault();

    if (taskInput === "") {
      toast.error("Por favor, digite uma tarefa!");
      return;
    }

    if (editTask?.id) {
      handleUpdateTask();
      return;
    }

    await addDoc(collection(db, "tasks"), {
      task: taskInput,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        toast.success("Tarefa registrada com sucesso");
        setTaskInput("");
      })
      .catch((error) => {
        toast.error("Não foi possivel cadastrar sua tarefa. Tente novamente!");
        console.log(`Erro: ${error}`);
      });
  }

  //Função de logout
  async function handleLogout() {
    await signOut(auth);
  }

  //Funão de deletar/concluir task
  async function handleDeleteTask(id) {
    const docRef = doc(db, "tasks", id);

    await deleteDoc(docRef);

    toast.success("Tarefa concluida com sucesso");
  }

  //Função de editar a task
  async function handleEditTask(item) {
    setTaskInput(item.tarefa);
    setEditTask(item);
    console.log(item);
  }

  async function handleUpdateTask() {
    const docRef = doc(db, "tasks", editTask?.id);

    await updateDoc(docRef, {
      task: taskInput,
    })
      .then(() => {
        toast.success("Tarefa atualizada com sucesso!");
        setTaskInput("");
        setEditTask({});
      })
      .catch((error) => {
        toast.warn("Falha ao atualizar tarefa!");

        console.log(`Erro: ${error}`);
      });
  }

  return (
    <div className="flex h-screen flex-col items-center bg-zinc-800 p-4 text-white">
      <h1 className="mb-4 text-4xl">ToDo List????kkkkkk</h1>

      <div className="mb-8 flex w-full max-w-xl flex-col rounded-lg">
        <form
          onSubmit={handleRegisterTask}
          className="form flex w-full flex-col gap-3"
        >
          <textarea
            placeholder="Digite sua tarefa"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="h-20 bg-zinc-700 p-2 text-base text-white placeholder:text-white/70"
          ></textarea>

          {Object.keys(editTask).length > 0 ? (
            <button
              className="btn-editTasks mb-4 h-9 cursor-pointer rounded-sm bg-blue-700 font-semibold text-white transition-all hover:bg-blue-800"
              type="submit"
            >
              Atualizar tarefa
            </button>
          ) : (
            <button
              className="mb-4 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-sm bg-emerald-600 font-semibold text-white transition-all hover:bg-emerald-700"
              type="submit"
            >
              <CiSaveDown2 size={20} />
              Registrar tarefa
            </button>
          )}
        </form>
      </div>

      {tarefas.map((item) => {
        return (
          <article
            className="mb-4 flex w-full max-w-xl flex-col justify-center rounded-sm bg-zinc-700 px-2 py-2"
            key={item.id}
          >
            <p className="mb-2 text-lg">{item.tarefa}</p>

            <div className="flex gap-2">
              <button
                className="flex cursor-pointer items-center gap-2 rounded-sm bg-emerald-600 p-2 font-semibold transition-all hover:scale-95 hover:bg-emerald-500"
                onClick={() => {
                  handleEditTask(item);
                }}
              >
                <FiEdit size={16} />
                Editar
              </button>

              <button
                className="btn-deleteTask flex cursor-pointer items-center gap-1 rounded-sm p-2 font-semibold text-amber-300 transition-all hover:scale-95 hover:bg-amber-300 hover:text-zinc-700"
                onClick={() => {
                  handleDeleteTask(item.id);
                }}
              >
                <MdTaskAlt size={18} />
                Concluir
              </button>
            </div>
          </article>
        );
      })}

      <button
        className="absolute bottom-4 left-4 flex cursor-pointer items-center gap-2 rounded bg-red-600 px-4 py-2 font-semibold transition-all duration-300 hover:bg-red-800"
        onClick={handleLogout}
      >
        <FiLogOut size={20} />
        Sair
      </button>
    </div>
  );
}
