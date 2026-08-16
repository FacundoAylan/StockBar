import InputCard from "./components/InputCard";
import useFileParser from "./hooks/useFileParser";

const Home = () => {
  
  const { handleFileChange } = useFileParser();


  return (
    <main className="w-full h-full text-white flex flex-col items-center justify-center p-4">
      <InputCard
        handleFileChange={handleFileChange}
      />
    </main>
  );
};

export default Home;

