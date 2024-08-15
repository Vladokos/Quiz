import Image from 'next/image';
import money from "../../public/images/money.svg"
import cross from "../../public/images/cross.svg"

export default function Header() {
  return (
    <header>
      <div className="max-w-1340 px-5 pt-10 mx-auto">
        <ul className="flex items-center content-center justify-between">
          <li className="flex items-center py-2 px-4 bg-whity rounded-lg text-1xl text-darkBlue "> <Image className="mr-2" src={money} alt='' width={23} height={23}/> 200</li>
          <li className="text-2xl">Fantasy Quiz</li>
          <li className="bg-whity rounded-full p-4 cursor-pointer"><Image src={cross} alt='' width={17} height={17}/></li>
        </ul>
      </div>
    </header>
  );
}
