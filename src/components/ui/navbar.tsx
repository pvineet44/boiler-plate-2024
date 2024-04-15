"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "/public/logo.png";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    key?: string[];
    variant: "default" | "ghost";
    href?: string;
    subLinks?: {
      title: string;
      label?: string;
      key?: string[];
      icon: LucideIcon;
      variant: "default" | "ghost";
      href?: string;
    }[];
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();
  const { data: session, status } = useSession();

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <div className="flex justify-center mb-2">
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) =>
            /* @ts-ignore */
            (link.key && link.key.includes(session?.role?.name)) ||
            !link.key ? (
              isCollapsed ? (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {link?.href ? (
                      <Link
                        href={link.href ?? ""}
                        className={cn(
                          buttonVariants({
                            variant:
                              link.href === pathName ? "default" : "ghost",
                            size: "icon",
                          }),
                          "h-9 w-9",
                          link.variant === "default" &&
                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-0">
                          <AccordionTrigger className="text-sm px-3 py-0  h-9">
                            <div className="flex items-center">
                              <link.icon className="mr-2 h-4 w-4" />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {link.subLinks &&
                              link?.subLinks.map((sublink, index) =>
                                (sublink.key &&
                                  /* @ts-ignore */
                                  sublink.key.includes(session?.role?.name)) ||
                                !sublink.key ? (
                                  <div key={index} className="">
                                    <Link
                                      href={sublink.href ?? ""}
                                      className={cn(
                                        buttonVariants({
                                          variant:
                                            sublink.href === pathName
                                              ? "default"
                                              : "ghost",
                                          size: "icon",
                                        }),
                                        "h-9 w-9",
                                        sublink.variant === "default" &&
                                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                      )}
                                    >
                                      <sublink.icon className="h-4 w-4" />
                                    </Link>
                                  </div>
                                ) : null
                              )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {link.title}
                    {link.label && (
                      <span className="ml-auto text-muted-foreground">
                        {link.label}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              ) : link?.href ? (
                <Link
                  key={index}
                  href={link.href ?? ""}
                  className={cn(
                    buttonVariants({
                      variant: link.href === pathName ? "default" : "ghost",
                      size: "sm",
                    }),
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                        link.variant === "default" &&
                          "text-background dark:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
              ) : (
                <Accordion
                  key={index}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="text-sm px-3 py-0">
                      <div className="flex items-center h-9">
                        <link.icon className="mr-2 h-4 w-4" />
                        <span className="mr-2">{link.title}</span>
                        {link.label && (
                          <span
                            className={cn(
                              "ml-auto",
                              link.variant === "default" &&
                                "text-background dark:text-white"
                            )}
                          >
                            {link.label}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {link.subLinks &&
                        link?.subLinks.map((sublink, index) =>
                          (sublink.key &&
                            /* @ts-ignore */
                            sublink.key.includes(session?.role?.name)) ||
                          !sublink.key ? (
                            <div
                              key={index}
                              className="ml-2 text-gray-900 w-40"
                            >
                              <Link
                                href={sublink.href ?? ""}
                                className={cn(
                                  buttonVariants({
                                    variant:
                                      sublink.href === pathName
                                        ? "default"
                                        : "ghost",
                                    size: "sm",
                                  }),
                                  sublink.variant === "default" &&
                                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                  "justify-start"
                                )}
                              >
                                <sublink.icon className="mr-2 !h-4 !w-4" />
                                <p className="text">{sublink.title}</p>
                                {sublink.label && (
                                  <span
                                    className={cn(
                                      "ml-auto",
                                      sublink.variant === "default" &&
                                        "text-background dark:text-white"
                                    )}
                                  >
                                    {sublink.label}
                                  </span>
                                )}
                              </Link>
                            </div>
                          ) : null
                        )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            ) : null
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}
