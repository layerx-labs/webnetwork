import { useEffect, useState } from "react";

import getConfig from "next/config";
import { useRouter } from "next/router";

import { NewFeatureModalView } from "components/modals/new-feature-modal/new-feature-modal.view";

import { WinStorage } from "services/win-storage";

const { publicRuntimeConfig } = getConfig();

export function NewFeatureModal() {
  const router = useRouter();
  
  const [isVisible, setIsVisible] = useState(false);

  const storage = 
    new WinStorage(`new-feature-modal-${publicRuntimeConfig?.newFeatureModal?.title}`, 0);

  function onCloseClick() {
    storage.value = true;
    setIsVisible(false);
  }

  function onVisitClick() {
    onCloseClick();
    router.push(publicRuntimeConfig?.newFeatureModal?.link);
  }

  useEffect(() => {
    setIsVisible(!storage.value && !!publicRuntimeConfig?.newFeatureModal?.isVisible);
  }, []);

  return(
    <NewFeatureModalView
      title={publicRuntimeConfig?.newFeatureModal?.title}
      description={publicRuntimeConfig?.newFeatureModal?.description}
      imageUrl={publicRuntimeConfig?.newFeatureModal?.image}
      featureUrl={publicRuntimeConfig?.newFeatureModal?.link}
      isVisible={isVisible}
      onCloseClick={onCloseClick}
      onVisitClick={onVisitClick}
    />
  );
}