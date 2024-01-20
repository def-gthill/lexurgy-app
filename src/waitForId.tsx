import { useRouter } from "next/router";

export default function waitForId(
  Component: React.FC<{ id: string }>
): React.FC {
  const Wrapper: React.FC = function () {
    const router = useRouter();
    const id = router.query.id;

    return router.isReady && typeof id === "string" ? (
      <Component id={id} />
    ) : (
      <div>Not ready</div>
    );
  };
  Wrapper.displayName = Component.displayName;
  return Wrapper;
}
