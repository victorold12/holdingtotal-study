"use client";
import { useEffect, useState } from "react";

const SOURCE =
  "https://pay.hotmart.com/G56454430C?off=jqigl9li&checkoutMode=2&embed=1";
export function CheckoutEmbed() {
  const [src, setSrc] = useState<string>();
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const apply = () => {
      // Observed loading priority: defer 1000ms after page load. The payment
      // provider remains external, just as in the reference; it is not rebuilt.
      timer = setTimeout(() => {
        const url = new URL(SOURCE);
        const query = new URLSearchParams(location.search);
        const values: string[] = [];
        for (const key of [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ]) {
          const value = query.get(key);
          if (value) {
            url.searchParams.set(key, value);
            values.push(value);
          }
        }
        const sck = query.get("sck") || values.join("|");
        if (sck) url.searchParams.set("sck", sck);
        setSrc(url.href);
      }, 1000);
    };
    if (document.readyState === "complete") apply();
    else window.addEventListener("load", apply, { once: true });
    const onMessage = (event: MessageEvent) => {
      // Intentional hardening: exact origin AND source, rather than substring
      // matching any hostname containing "hotmart.com" like the reference.
      const frame = document.getElementById(
        "hotmart-checkout-iframe",
      ) as HTMLIFrameElement | null;
      if (
        event.origin !== "https://pay.hotmart.com" ||
        event.source !== frame?.contentWindow
      )
        return;
      const data = event.data;
      const candidate = Number(
        data?.height || data?.iframeHeight || data?.payload?.height,
      );
      if (Number.isFinite(candidate) && candidate > 0 && candidate <= 20000)
        setHeight(Math.trunc(candidate));
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", apply);
      window.removeEventListener("message", onMessage);
    };
  }, []);
  return (
    <div className="checkout-embed-wrap">
      <div className="checkout-embed-bar" />
      <div
        className={`checkout-loader${loaded ? " hide" : ""}`}
        id="checkoutLoader"
      >
        <div className="spin" />
        <div className="lbl">Carregando checkout seguro</div>
      </div>
      <iframe
        id="hotmart-checkout-iframe"
        title="Checkout Hotmart, Imersão Holding Total"
        src={src}
        data-src={SOURCE}
        style={height ? { height } : undefined}
        onLoad={() => {
          if (src) setLoaded(true);
        }}
        allow="payment *; clipboard-read; clipboard-write; camera; microphone"
        allowFullScreen
        frameBorder="0"
        referrerPolicy="no-referrer-when-downgrade"
        scrolling="no"
      />
    </div>
  );
}
