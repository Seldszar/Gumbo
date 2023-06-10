import { IconHeart, IconInfoCircle, IconPower, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";
import { CurrentUser } from "~/common/types";

import AboutModal from "./modals/AboutModal";
import DonateModal from "./modals/DonateModal";

import DropdownMenu from "./DropdownMenu";
import Image from "./Image";

const Wrapper = styled.button`
  ${tw`bg-white dark:bg-black flex-none overflow-hidden relative rounded-full w-10 hover:(ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-purple-500)`}
`;

interface ProfileBadgeProps {
  className?: string;
  user: CurrentUser;
}

function ProfileBadge(props: ProfileBadgeProps) {
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isDonateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        placement="right-end"
        items={[
          {
            type: "normal",
            title: t("optionValue_settings"),
            icon: <IconSettings size="1.25rem" />,
            onClick() {
              open(browser.runtime.getURL("settings.html"), "_blank");
            },
          },
          {
            type: "normal",
            title: t("optionValue_aboutHelp"),
            icon: <IconInfoCircle size="1.25rem" />,
            onClick() {
              setAboutOpen(true);
            },
          },
          {
            type: "separator",
          },
          {
            type: "normal",
            title: t("optionValue_donate"),
            icon: <IconHeart size="1.25rem" />,
            onClick() {
              setDonateOpen(true);
            },
          },
          {
            type: "separator",
          },
          {
            type: "normal",
            title: t("optionValue_logout"),
            icon: <IconPower size="1.25rem" />,
            onClick() {
              sendRuntimeMessage("revoke");
            },
          },
        ]}
      >
        <Wrapper className={props.className}>
          {props.user && <Image src={props.user.profileImageUrl} ratio={1} />}
        </Wrapper>
      </DropdownMenu>

      {isAboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {isDonateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </>
  );
}

export default ProfileBadge;
