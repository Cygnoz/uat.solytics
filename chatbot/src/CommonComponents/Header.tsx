import logo from "../assets/Icons/cygnozIcon.png"
import profile from "../assets/Icons/profileicon.png"

type Props = {}

function Header({ }: Props) {
    return (
        <div>
            <nav className="flex justify-between bg-[#FFFFFF] px-10 py-3">
                <a href="" className="flex items-center">
                    <img
                        src={logo}
                        alt=""
                    />
                    <span className="text-[20px] font-[500] ps-2 text-[#000000]">Cygnozbot</span>
                </a>
                <img src={profile} className="" alt="" />
            </nav>

        </div>
    )
}

export default Header