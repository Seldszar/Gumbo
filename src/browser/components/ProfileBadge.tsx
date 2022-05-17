import React, { FC, useState } from "react";
import tw, { styled } from "twin.macro";

import { useAccessToken } from "../helpers/hooks";

import AboutModal from "./modals/AboutModal";
import SettingsModal from "./modals/SettingsModal";

import ContextMenu from "./ContextMenu";
import Image from "./Image";

const Wrapper = styled.button`
  ${tw`bg-white dark:bg-black flex-none h-10 overflow-hidden relative rounded-full w-10`}
`;

const ProfileImage = styled(Image)`
  ${tw`h-full w-full`}
`;

interface ProfileBadgeProps {
  className?: string;
  user: any;
}

const ProfileBadge: FC<ProfileBadgeProps> = (props) => {
  const [, store] = useAccessToken();

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <ContextMenu
        placement="right-end"
        menu={{
          items: [
            {
              type: "link",
              children: "Settings",
              icon: (
                <svg viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ),
              onClick() {
                setSettingsOpen(true);
              },
            },
            {
              type: "link",
              children: "About & Help",
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
              children: "Logout",
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
            {props.user && <ProfileImage src={props.user.profile_image_url} />}
          </Wrapper>
        )}
      </ContextMenu>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
};

export default ProfileBadge;
