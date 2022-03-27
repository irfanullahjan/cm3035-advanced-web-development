import Link from "next/link";
import { useRouter } from "next/router";
import { NavItem, NavLink } from "reactstrap";

type Props = {
  links: any[];
};
export function NavbarLinks(props: Props) {
  const { links } = props;
  const router = useRouter();
  return (
    <>
      {links.map((link) => (
        <NavItem key={link.href}>
          <Link href={link.href} passHref>
            <NavLink active={router.asPath === link.href}>{link.text}</NavLink>
          </Link>
        </NavItem>
      ))}
    </>
  );
}
