'use client';
import { authState } from "@/states/auth";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "@nextui-org/navbar";
import Link from "next/link";
import { useRecoilState } from "recoil";

export const HeaderNavigation = () => {
    const [auth, setAuth] = useRecoilState(authState);
    return (
      <>
        <Link className="font-bold text-sm mr-6" color="foreground" href="/">
            홈
        </Link>
        <Link className="font-bold text-sm mr-6" color="foreground" href="/timetable">
            시간표
        </Link>
        <Link className="font-bold text-sm mr-6" color="foreground" href="/calculator">
            학점계산기
        </Link>
        <Link className="font-bold text-sm mr-6" color="foreground" href="/notice">
            공지사항
        </Link>
        <Link className="font-bold text-sm mr-6" color="foreground" href="/help">
            문의
        </Link>
        {
          auth.isLoggedIn ||
          <Link className="font-bold text-sm" color="foreground" href="https://api.kyonggiti.me/google">
              구글 로그인
          </Link>
        }
      </>
    );
}