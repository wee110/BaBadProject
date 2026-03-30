import React from 'react';
import { User, Lock, Search, MapPin } from 'lucide-react';
//Import ไฟล์รูปภาพ
import shuttlecockIcon from './shuttlecock.png'; 

function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-800 relative overflow-hidden">
      
      <div className="absolute top-10 right-[-5%] opacity-[0.03] rotate-45 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="w-16 h-16 border border-black"></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 left-[-5%] opacity-[0.03] -rotate-12 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="w-16 h-16 border border-black"></div>
          ))}
        </div>
      </div>

      {/* Header / Navigation Bar  */}
      <header className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <span className="text-xs text-gray-400 font-medium ml-4">BaBadProject</span>
        </div>
        
        <div className="flex-1 max-w-lg relative mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input 
            type="text" 
            className="w-full bg-[#F1F3F4] border-none rounded-md py-1 pl-10 pr-4 text-xs focus:ring-1 focus:ring-green-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
        </div>

        <div className="flex-1 flex justify-end">
          <button className="bg-[#94C141] text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Shelf Nort
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 z-10">
        
        {/* Logo & Title Section  */}
        <div className="w-full max-w-2xl mb-12 relative flex items-center justify-between border-b border-gray-200 pb-1.5">
          <div className="flex items-center">
            {/* ปรับให้ไอคอนเอียง*/}
            <div className="mr-6 transform -rotate-12 w-[64px] h-[64px] flex items-center justify-center">
               {/*ใช้แท็ก <img> เรียกรูปภาพ */}
               <img 
                 src={shuttlecockIcon} 
                 alt="Shuttlecock Icon" 
                 className="w-full h-full object-contain" // ให้รูปขยายเต็มกรอบโดยไม่เสียสัดส่วน
               />
            </div>
            {/* หัวข้อ */}
            <h1 className="text-[40px] font-black tracking-tight leading-[0.9] uppercase italic text-gray-900">
                Badminton Court<br/>Reserve
            </h1>
          </div>
        </div>

        {/* Login Card  */}
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-50 flex flex-col items-center">
          <div className="mb-6">
            <div className="border-[1.5px] border-gray-900 p-3 rounded-lg">
                <MapPin size={32} strokeWidth={1.5} className="text-gray-900" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-8 text-gray-800">Login to Book</h2>

          <form className="w-full space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Username or Email Address" 
                className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-[#94C141] transition-colors bg-gray-50/50"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-[#94C141] transition-colors bg-gray-50/50"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#94C141] hover:bg-[#83ac3a] text-white font-bold py-3.5 rounded-lg transition-all duration-300 mt-2 shadow-md active:scale-[0.98]"
            >
              Login
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}

export default App;