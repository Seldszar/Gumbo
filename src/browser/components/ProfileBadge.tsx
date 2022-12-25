import React, { FC, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useAccessToken } from "../helpers/hooks";

import AboutModal from "./modals/AboutModal";
import DonateModal from "./modals/DonateModal";

import ContextMenu from "./ContextMenu";
import Image from "./Image";

const Wrapper = styled.button`
  ${tw`bg-white dark:bg-black flex-none overflow-hidden relative rounded-full w-10 hover:(ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-purple-500)`}
`;

interface ProfileBadgeProps {
  className?: string;
  user: any;
}

const ProfileBadge: FC<ProfileBadgeProps> = (props) => {
  const [, store] = useAccessToken();

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
              icon: (
                <svg viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ),
              onClick() {
                open(browser.runtime.getURL("settings.html"), "_blank");
              },
            },
            {
              type: "link",
              children: t("optionValue_aboutHelp"),
              icon: (
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                  <polyline points="11 12 12 12 12 16 13 16" />
                </svg>
              ),
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
              icon: (
                <svg viewBox="0 0 24 24">
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              ),
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
              icon: (
                <svg viewBox="0 0 24 24">
                  <path d="M7 6a7.75 7.75 0 1 0 10 0" />
                  <line x1="12" y1="4" x2="12" y2="12" />
                </svg>
              ),
              onClick() {
                store.set(null);
              },
            },
          ],
        }}
      >
        {(ref) => (
          <Wrapper className={props.className} ref={ref}>
            {props.user && <Image src={props.user.profile_image_url} ratio={1} />}
          </Wrapper>
        )}
      </ContextMenu>

      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />
      <DonateModal isOpen={isDonateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
};

export default ProfileBadge;
