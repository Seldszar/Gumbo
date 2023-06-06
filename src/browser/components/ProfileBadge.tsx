import { IconHeart, IconInfoCircle, IconPower, IconSettings } from "@tabler/icons-react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";
import { CurrentUser } from "~/common/types";

import AboutModal from "./modals/AboutModal";
import DonateModal from "./modals/DonateModal";

import ContextMenu from "./ContextMenu";
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
      <ContextMenu
        placement="right-end"
        menu={{
          items: [
            {
              type: "link",
              children: t("optionValue_settings"),
              icon: <IconSettings size="1.25rem" />,
              onClick() {
                open(browser.runtime.getURL("settings.html"), "_blank");
              },
            },
            {
              type: "link",
              children: t("optionValue_aboutHelp"),
              icon: <IconInfoCircle size="1.25rem" />,
              onClick() {
                setAboutOpen(true);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: t("optionValue_donate"),
              icon: <IconHeart size="1.25rem" />,
              onClick() {
                setDonateOpen(true);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: t("optionValue_logout"),
              icon: <IconPower size="1.25rem" />,
              onClick() {
                sendRuntimeMessage("revoke");
              },
            },
          ],
        }}
      >
        {(getReferenceProps) => (
          <Wrapper className={props.className} {...getReferenceProps()}>
            {props.user && <Image src={props.user.profileImageUrl} ratio={1} />}
          </Wrapper>
        )}
      </ContextMenu>

      <AnimatePresence initial={false}>
        {isAboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isDonateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default ProfileBadge;
