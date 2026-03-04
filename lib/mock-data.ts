/**
 * ============================================================
 * Mock Data — Static product/category/feed data for development
 * ============================================================
 *
 * All image URLs are from the HTML mockups in the `ui/` folder.
 * Replace with Supabase queries when the backend is wired.
 *
 * Usage:
 *   import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_FEED_ITEMS } from "@/lib/mock-data";
 * ============================================================
 */

import type { Product, Category } from "@/types";

// ---------------------------------------------------------------------------
// Categories (Vibe Bubbles)
// ---------------------------------------------------------------------------

export const MOCK_CATEGORIES: Category[] = [
    {
        id: "cat-1",
        name: "Campus",
        slug: "campus",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD5_fAA6XlFp8djyGLdnzQ61v-Ne-JWIib8MaI-Rs9S3LUQHghFt5hyK_NTlv4hLs0G0tJe3AIcXUr9-59vRcQil2GLCTfwZS-kNYnAvhFKUpv-P5JpSAnFDqVjTmBxnwmS9a_kQjse7XkRpy2Y3p5MXqg_E55M758IhjWq_nOYhxTUZE2W26wWMG1OTDB9udwuuy7exDLPKdBxOqOdmH_lFdtui7Am9qlzp2Gmd9vA7FUuvDcgg9WAdRoH3RbJjnqTTuXU5uP8AuE",
    },
    {
        id: "cat-2",
        name: "Office",
        slug: "office",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBtKfmc-Vr8wChS2z6Zmi0HP2xveDtS8dtJLHG15z608OnM4Jolbrz8c93Q9HwMNGjI5LKsKtXQEL-iZsY5DaBEJ9dXjU66RvPawELvs9GGfWVqjPaJ28AaHcaGCxrFq6ahT2cyhT7Zbek0jpdzFNQSR5uw4mFHo6jsPPwk5EkJL2nJIxmpH_8KcePoBIp7XwBSmZ9Xq5Cp7pem05NaH-ZPzmbYtc4SJfYLAkQDsOlcZehefzsU1auO2OPFE57b3DbjLM6pYCym0ZE",
    },
    {
        id: "cat-3",
        name: "Wedding",
        slug: "wedding",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBVmz5L3THjFbi5UjiTs_y0w-LYvjLG-ll2_FcsRzya5K2UsKpB9xj2Qu5-yGnQAlWDF6mLZgl4EvD68edHM6EW3JBSXbYyjDjxqU-vMCtSNAUotSdpWiDXttrbMKfmx5lEYHEDjZaFIL-m5MniFtlMhHLzZKu-TtlevIsPjQEoAIyPlOpBwmRvYASe2k7oN6l8chF9BHw1pB23bMvGfCwCVDm91cDCFdsdFgGB5-ctw2MxeLHEhbRqrfbtqGadFLIvxp-aVu3BJ-8",
    },
    {
        id: "cat-4",
        name: "Party",
        slug: "party",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBeDUh9JnSkdBKP8FqZScIseiCm5qnnCw5QGWIso9euIeCUI0teiIwnUXaO7Hlcv2cm1Lt1KTMtKnEovcWbibvBh1j3xXn4qh9UknZTSSZH622wM8mmh0Vov3gfCtnujfrfWLllBb_V5PKPPm7Tktu2xMvcvB57-Vah_YJXYZpKoj1-xwsbD5l00Y0dy51Nt1VGlR3YofQVLQpCp3bHIW1qrZO_g0pxaXrU-XcvhVzoBOyoQzba7EKW2DCtBK89L-9pJNHN5XukQz4",
    },
    {
        id: "cat-5",
        name: "Gold",
        slug: "gold",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBMC_2z9czs-B3oTMd4KyJMsloSJI2YMnGjkQRS5HzjEenOP36IyHaymopgVy_kE5pPT5VWYeLQ4g_LI9G-h4joGh3olMiJvtEJqM82axiJ4EmsM3OUMF1Zh2vhhxdwWincQpXvHQVJBCfIcPFr9MZm8VSgrioUQeLM1F3spmTPFWk-wKeEeCreMyxqDnH--KyIk-szwkmXGf7cIx7RwK7BK9JocJywT6l3Nq5t-UMJ5ShvOqf1wEifDa5uqe1BK8D8cdItVzRDQ_Q",
    },
];

// ---------------------------------------------------------------------------
// Products (mirrors Supabase `products` table)
// ---------------------------------------------------------------------------

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "prod-1",
        title: "Rose Gold Layered Chain",
        description: "A stunning layered chain necklace in warm rose gold tones.",
        cost_price: 250,
        selling_price: 699,
        discount_price: 399,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDT375_lHBGeGLuyGwQhaMsXxx3uj994SuOiyaLDIPf9LxFBd-nmwfXrl0ppgSVoXuE_EEXNipmGQO63NEB8OUTl5x_aOf-BcQDiDfB8T6_jWB5tE2I7PRyocp_2HbFS9Yb8WjU7A_m_uWLXjGx0SVNyda_YU47srIM8N9Ny8kMtinhvP3cc_SV8sGeWms7IPXuoEyKUXwobiWKepbdvdVy-0qtzFDvfWkJZuVDCObuxGNg0tptenRjz0-SRkvsBfvHKAGiN14s21Y",
        ],
        category_id: "cat-necklaces",
        attributes: { tags: ["best-seller", "campus", "office"] },
        stock_count: 25,
        is_active: true,
    },
    {
        id: "prod-2",
        title: "Sterling Silver Hoops",
        description: "Classic sterling silver hoop earrings for everyday elegance.",
        cost_price: 350,
        selling_price: 899,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBY1QwOrs-B5WP6szzXQSBcGlpRhmYq3HX4ZdR3-kH9_6XV8TgEjgFlqqz_L0VgoTrNp8O-1OifAoI7HuDhpsURlxzoIa5qlBrSL53vcRrHUHa_pX75VW_hYSf-dkabiY7F7k_ycBRDre61CKfIZnAb349WhdFVk3XuHkeucHE4xFLnTMTe5MGAwu4gspjC5LKffMSGm2qY51p-NGcqiR3Qp0pMz3g2QixwSgTpiKtQcZ4tefc1XteahoyH7ku1iYci9CgcvfytTJo",
        ],
        category_id: "cat-earrings",
        attributes: { tags: ["trending", "office"] },
        stock_count: 40,
        is_active: true,
    },
    {
        id: "prod-3",
        title: "Crystal Solitaire Ring",
        description: "A dazzling crystal solitaire ring that catches every light.",
        cost_price: 200,
        selling_price: 999,
        discount_price: 499,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD0y4Q0amuV_PeXpmTER5eEjjJEjiHHlal9PUunrrVsQbbbfdyQwaYWlQysoandnLJkQuODqnyXOdl5t32RVHXxpiqZsYIm6oJHTizxUMHVZguvWQwlNdTTfH_97OmppB_iJu1pmD3CuDd_rskGST022sC8kjX5nYfwrVg0wzH0NOmj_EACpefVzmN05wsIkih83CPLrJOdNGETOXz-ptTdIhKaFbQpvPQ-1uLxdsvw9r4Az1E93G3cGqS8txZv_6wj4l4XN3Zs8J8",
        ],
        category_id: "cat-rings",
        attributes: { tags: ["new-arrival", "party"] },
        stock_count: 15,
        is_active: true,
    },
    {
        id: "prod-4",
        title: "Vintage Pearl Bracelet",
        description: "Hand-strung freshwater pearls on a delicate gold clasp.",
        cost_price: 500,
        selling_price: 1299,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBJxC4IAG1iGx-6ppSWbP3qtdOdXnUvDR_E7-gZY8ClwVlZlwxFDWbktYGwJxWzC0acdxZTA1vdxHPBmzIgK3k4doAxoydzoLAAJtAPF1aCp0r41BI9S5cbtdZ0iIN5FyIUNP3gz3n56tzagqltaycPQBiTatABXWTN2Gl5dgkdCTHpuQtVvH4z6SBZ9dIj2WFOOx2t3EIF3rvDbplf6WZC6Y7uwLi7xa2QDOHgree2mglw7gmTyZMCdBU_basXva4cIfGCCSekMZQ",
        ],
        category_id: "cat-bracelets",
        attributes: { tags: ["new", "wedding"] },
        stock_count: 10,
        is_active: true,
    },
    {
        id: "prod-5",
        title: "Gold Hoop Earrings",
        description: "Elegant gold-plated hoops with a polished finish.",
        cost_price: 180,
        selling_price: 499,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC33BuFZw0p77GtKRns9Vj58zlScVUbjCdaQzRwe4MwOcAQ1sMsBDqONQP6XG7nFZiRgQq3ug8cyb_U2Cx9QTTk2erQfyMJGkS1Hr6PRl9L07X701-wEWvcXV50pHCBNTtAd6B_4fc7eccHf3WhGJKqU1HO0vffn5u431sPYHqI1oo03MKGVbsfXstAVBwGb8gDS5MkyCJFpLIWTzRCKlxAgwimooj40WHWj1ULjhPqu7VwhIeLhE9xLPp4eHJJq4VWStzymiV-vic",
        ],
        category_id: "cat-earrings",
        attributes: { tags: ["best-seller", "campus", "gold"] },
        stock_count: 50,
        is_active: true,
    },
    {
        id: "prod-6",
        title: "Neon Matte Hoops",
        description:
            "Bold, vibrant, and effortlessly chic. These matte finish hoops are designed to make a statement while remaining lightweight enough for all-day wear.",
        cost_price: 150,
        selling_price: 899,
        discount_price: 399,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDENxpbsLKjQc4XXOInn7njyvekgDhlb-gXa_anLNMCWLXiYGMt2q4pAekO8RVivtHoHZMZ6-lLw0NW6eqnwZjAHaVfyotCBfJfad4TjN8INhlPouieu44cIbF_J5-cyl5vGbvanP1aDGMulnv8C5-yASeei9bOTUXDXPcXqOP2pMuyR3wXqX04TFFVQsZAuZNJGhcgUd48fq0Xrr3_j7lKlqLYtVrblDbu3S3EwQu2Kogx38UzB8E2g9ez1xbaxJM4C09H-xF7OxQ",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9Z6wwFaz7SpiexNx_idKO6jufQM9hc3kvcPWhb6XiwYA2vK3JtDcxFeyEGWo5y-jSPS0xdU6KHsX8Rk__SdzGzcwN38BSuw3DO5cqgRi2lpNsTz6QuAigKYa9qRPDWTzz2-Y8IP0AdU6V3r204G8Q83nYyk45PlElFOs-bsKN6fzIumLbSfL0m2ts9GN0P-hqQQ7323Ui2NSjxIdrXyjIL2MjF8TvrBQgWUbNNWGu5MSBx1p6wN7e7nk7dRiNumF0CEGq7pbPE8",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDg8uc9Wo8_hdHRHHa-G0gQVvOXQPPSdGYJme47JL-xI23IFuX4kaEYj2jNJGFyf0ZKaGs3N6WSpvV5RIInQNEuWUniTfPNtZuCOEDji2KqrhV7OQzolU61uen9c206oyp4X2qeRkzEdNxezrhdnnYDmyC4tkLGWdQ2r7JVEB8lMCfWTtjx6HZluxPn5k_txV6hpHFvkFBWu_BUmNZUvCKFysS-gYnz8Y7sYadthEWru2T24FraHeWzRlF0j40H25ZUygiZOLyfx6g",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDGzbwEzlepCgoxzpyAZFTFNl8ay29aYOrohJcJbagxUPlkKQc-nTEM8CJBhAMtzGRTxJRpLtwDtc-LRfGut2CLxI6IGyrQqWK5ONUFBh7uldkhzeUYe7381DdGHkRzcpD8R7Oaj8YHe5PLY2-8WfszHcRX6OqDthgZWabzLP-FUt0mq5hmBEANreyMMf-1W5dekJxRhNRa-GS6N4j1QndROXyiQUqy7mkuvTAjuqncyZDCSrLOgn3iRD_2qN-335-DzfgV6fs_5Gk",
        ],
        category_id: "cat-earrings",
        attributes: { tags: ["best-seller", "party", "campus"] },
        stock_count: 30,
        is_active: true,
    },
    {
        id: "prod-7",
        title: "Crystal Choker Necklace",
        description: "A sparkling crystal choker for special occasions.",
        cost_price: 300,
        selling_price: 799,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBntjj0AnAFtyq2FptEM8vkPzDMYZlsOeLjQ4FiyvuXh1gVWrpfCzycDMiMJpz7lmKkT3S0PcibIBcYcWNTMJovn8C-kUspWVt3v4RwivAdPy-keO3jh-4e3YCFX85ekGam9HXVnHlwf_wCLQtMegVkBvyTwxE5EMF7Vfy5cYNtIfpZX1gJZlFDaBw8c3EoHxyEKCRGehsAvRnxZCQDHPDPMq-1IDXHqYd4Imvt1dqOQae-2s8bUtI3Uo6m961aLDEvqJrd0IynMpE",
        ],
        category_id: "cat-necklaces",
        attributes: { tags: ["party", "wedding"] },
        stock_count: 20,
        is_active: true,
    },
    {
        id: "prod-8",
        title: "Sterling Silver Ring",
        description: "Minimalist sterling silver band, perfect for stacking.",
        cost_price: 220,
        selling_price: 599,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB1lefcI-bJpiKlQ4Ezey9JkA8GDHCfe_NB13N3_9Xua-EHWn8RJeP99PVMki6NXxnHDdT578GoIaFJ6d5mrj_s_ZuiQrSZXaxLS7jldghWsQmHi-BPJu95-SY32oknKn6sRPxuQOF9KAzJLQgLagx3t1dLaMzdqVl2r0DZJErMe2Gevzl1gglo8z8kahm5e36PcqEd6MD_wifHVlPePqE1vxhDeP5gnQvWNWhQUtvWL6o6KWP5DBTRU-2uDv2_8_iSJP3-4lSraK8",
        ],
        category_id: "cat-rings",
        attributes: { tags: ["office", "campus"] },
        stock_count: 35,
        is_active: true,
    },
    {
        id: "prod-9",
        title: "Pearl Bracelet",
        description: "A classic pearl bracelet for the modern woman.",
        cost_price: 120,
        selling_price: 299,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDQSafpC_Gs3y7TQc0sdcOijDuR9_UoazyfyHNEWjdr5Id0yF2GQrtn73_LKvsbLY9tqVbWVqBc0PfqhxYAqasGm9MhqkZKspdYP7YQQJEULBw28LYc_v1AKDomArT_skfxC96szvklo_28iNIhAG_eBNkVyQeUvVZgg6K4NiozcI-zfbEJbQD-FTai4G5hxifeYhmoqKodH8ldhsyiPUppb5CRlZB_7kFSywuQz6YM9WT4lyaiCPh1Pjo3aJFT_NY_lz-Pqgb9GxY",
        ],
        category_id: "cat-bracelets",
        attributes: { tags: ["campus", "office"] },
        stock_count: 45,
        is_active: true,
    },
    {
        id: "prod-10",
        title: "Rose Gold Pendant",
        description: "Delicate rose gold pendant with a shimmering stone.",
        cost_price: 350,
        selling_price: 899,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCFB_-Wt4cmPUteP_qXlMZOxgTmIWatON3A4-zg4OmDvZ2NU2b_e4rwkcc6ctylM2m50cbX5prngkR8aF0BOHf0VppxFWar6NV2PCDE4hIrpDr8Ki_DCF4YrJmRnHbEDCkJkGHWiGrkdX30xiMRUqy3I1CoyGPpZ5UBTqV_jm-8owD59_enN26yAZ5e77e0-m11fEL8iS0AaOPOpd_faK5uTFi9x6TZBvgdfYuDIdySSAikzmipsgfvObrZ0byL-pAC-_ajRMeKb1w",
        ],
        category_id: "cat-necklaces",
        attributes: { tags: ["gold", "wedding"] },
        stock_count: 18,
        is_active: true,
    },
    {
        id: "prod-11",
        title: "Diamond Studs",
        description: "Sparkling diamond stud earrings for timeless elegance.",
        cost_price: 500,
        selling_price: 1299,
        media_urls: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAC2dwf0w4OCGu9Gq60CurNVmVqMtvQCp7q-zHeDrNSIAZr6ODdh5aXxl_3w6LJd5TTyE1vkUKt9yand1hcwp2fDmyULvC4MjlMEswijPbXYvlfLlYAJJNGMZcQ8FIyINAu_QGtPyK97QYrQwfmNjwcwZ_itwAJrhKWgWV0MlS2j68PB5rwZPVm5-hx11uwo23DnjDMYkiL8DWyyJGnwOipmsGK68ym69Ecab-grgbjPyDyth_cVvpzx13mjjeFsEhWTQM0BvTrhvY",
        ],
        category_id: "cat-earrings",
        attributes: { tags: ["party", "wedding", "gold"] },
        stock_count: 8,
        is_active: true,
    },
];

// ---------------------------------------------------------------------------
// Hero Banners
// ---------------------------------------------------------------------------

export interface HeroBanner {
    id: string;
    image: string;
    badge: string;
    badgeVariant: "primary" | "white";
    title: string;
    subtitle: string;
}

export const MOCK_BANNERS: HeroBanner[] = [
    {
        id: "banner-1",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDPA2fONbwFjU-w4_Fztnvn7P_MKSHbF_sXcblAVKXe2v0-mOx8LjwcelO7ZkyIzXy0T18cx-_UaNcWaEkR1jklQqi1CjiwwWBHb_PXQF0iY0Cc4qtl30RFSOfGRjUDkq5kD49hYtFTv62j3dmU8Zv7Rfv8qys6tgyxneiSZD3gj8oAtxzGsxyViDSlCltH7MBe0gqWgofirVHIim3cb_ODQQkjpukgOh0A3WIApowOs7iXIn8NJm_z1aWGrM_G3AUbZz8HRAU3-e8",
        badge: "Limited Time",
        badgeVariant: "primary",
        title: "Today's Specials",
        subtitle: "Up to 50% off select styles",
    },
    {
        id: "banner-2",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCVDZKDAMWDV7aVTCaSfSHnmoCMEp2zpcw3v3U9lsZKSbHdTdS8CuPnKnJl1y14wsxkNuvRmloMrBzpUEobyr6o-XB3dcnNboScAkwk1hU7W0Zbj_IRfoT257e-5666fe0esn5lPuIg5Y31uOOFdY0160r6dpuiodxUO9vX3Iv3bKmxNOEoQiXhoWNzNE_YfudvfHdfZMryfv63Twv6qqf9FizayRPW8LTyFzwIa0s4YJ2vLOKptA5ffxMIYev8_mqU0fty2Q2mrOs",
        badge: "New In",
        badgeVariant: "white",
        title: "Flash Sales",
        subtitle: "Grab them before they're gone",
    },
];

// ---------------------------------------------------------------------------
// Feed Items (TikTok-style)
// ---------------------------------------------------------------------------

export interface FeedItem {
    id: string;
    username: string;
    userAvatar: string;
    backgroundImage: string;
    caption: string;
    hashtags: string[];
    audioLabel: string;
    likes: string;
    comments: string;
    product: Product;
}

export const MOCK_FEED_ITEMS: FeedItem[] = [
    {
        id: "feed-1",
        username: "@sophia_styles",
        userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBYLYjhAgZjNeC0Tr2xICukpCu1EtcY4EOh0xC_yru74MgvSjzf8NVOXcZgsgBGMW-o_nwe80k6bo9k3J02GjD70SwuVDHGKTMxY7GULNWkfQC40IQum-Q6_TaB2ZDRf-2CAhYumqYR017oc7JttgN8mf3OxUY11WnI1BNZP-n4PPHLFF0OkEh4dAquXMufsHdHJrchGG0ApEINmgD4l6oVClHeG84Mr2dbHluu9KFNN57lMBXPr3CJy-0xIdq7S1c7fhUzFStcGsY",
        backgroundImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBVG69V9FLn_5Q1vRf3uc_6AT1JCn6DDRYJ7M64vrNeH7XXEHgr9DbTaqgCdyzU8i-HwX8dNQH8WvpYHp_3jm9ClyLQ-fFkGsZnYtBGnaaX-Lg9AV3a2o4A4OyjhU3NNYPt_T8ZKM3aLFSvMS_5E__xZ6jLcOdrEnMCPLs_RKGuoNNm9RD0oMBr7QpJ4GYLCSoKdd3_KKRs_W2qCv53-Y34iqXLHh6W69a3EWWj3GBTQqO38_-X9RH-1wRrA5Mzmn2mbDIFDwWcpVE",
        caption: "The perfect office accessory! Adding a little sparkle to Monday morning ✨",
        hashtags: ["#JewelryLounge", "#OOTD"],
        audioLabel: "Original Audio - Sophia Styles",
        likes: "12.5K",
        comments: "482",
        product: {
            id: "prod-1",
            title: "Rose Gold Layered Chain",
            description: "",
            cost_price: 250,
            selling_price: 1299,
            discount_price: 599,
            media_urls: [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCBP_Ub5HTX_f8bNmJ8sxxFxqzA_uJFJo0Qz4iQFJqAKBk91tqwFlVGIOn1eNgvyGu-sqxP6ZSS8kaoqjA0laTLvYHwabvSASR1YOQsnNURXZIpDneyVY9WoB9VhLQ2ELyR15HUQoKzXSYprMxAVplGFlEpyN5fEGOks-vSkq2NqBOR2PwqG-gFRlHuasmznR28RUjeVH60LxflkRUt9JP0lwlskz6h_XuAULCveTaDvumKLuCyHh61qhROfGMFSNbLjTiirXqlaQY",
            ],
            category_id: "cat-necklaces",
            attributes: { tags: [] },
            stock_count: 25,
            is_active: true,
        },
    },
    {
        id: "feed-2",
        username: "@priya_jewels",
        userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGKP8LHEBNeUhgt2mdfMtBz0bgtBCWj87qiJ4oO3Q8I_r3g1FleCUaue2JwLxxLWSESDWRyTwV6FUD0XCL9AXJfA2kJSE6XUjN_8wg1zSy5aV-_jcBw-5lhYa7HfFaPrVooWCqZT3bilW47X7jsiceoSod9pxKS9PESNHmW2PnoBLk2-GQjW82VEd231bgIJn97UIKAVFNzWncQ27sRnJ_wOsft9l1aeZUH0kVkpSo0ujHsxk9t5LOqXwGDIYPoWa4uBryhLPOFqY",
        backgroundImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDENxpbsLKjQc4XXOInn7njyvekgDhlb-gXa_anLNMCWLXiYGMt2q4pAekO8RVivtHoHZMZ6-lLw0NW6eqnwZjAHaVfyotCBfJfad4TjN8INhlPouieu44cIbF_J5-cyl5vGbvanP1aDGMulnv8C5-yASeei9bOTUXDXPcXqOP2pMuyR3wXqX04TFFVQsZAuZNJGhcgUd48fq0Xrr3_j7lKlqLYtVrblDbu3S3EwQu2Kogx38UzB8E2g9ez1xbaxJM4C09H-xF7OxQ",
        caption: "These neon hoops are everything! 💕 Perfect for the weekend vibes",
        hashtags: ["#JewelryLounge", "#NeonVibes"],
        audioLabel: "Trending Sound - Bollywood Mix",
        likes: "8.2K",
        comments: "234",
        product: {
            id: "prod-6",
            title: "Neon Matte Hoops",
            description: "",
            cost_price: 150,
            selling_price: 899,
            discount_price: 399,
            media_urls: [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDENxpbsLKjQc4XXOInn7njyvekgDhlb-gXa_anLNMCWLXiYGMt2q4pAekO8RVivtHoHZMZ6-lLw0NW6eqnwZjAHaVfyotCBfJfad4TjN8INhlPouieu44cIbF_J5-cyl5vGbvanP1aDGMulnv8C5-yASeei9bOTUXDXPcXqOP2pMuyR3wXqX04TFFVQsZAuZNJGhcgUd48fq0Xrr3_j7lKlqLYtVrblDbu3S3EwQu2Kogx38UzB8E2g9ez1xbaxJM4C09H-xF7OxQ",
            ],
            category_id: "cat-earrings",
            attributes: { tags: [] },
            stock_count: 30,
            is_active: true,
        },
    },
];

// ---------------------------------------------------------------------------
// Filter Pills
// ---------------------------------------------------------------------------

export const FILTER_PILLS = [
    { id: "under-499", label: "Under ₹499" },
    { id: "trending", label: "Trending" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "best-sellers", label: "Best Sellers" },
];

// ---------------------------------------------------------------------------
// Trending Categories (Discover page)
// ---------------------------------------------------------------------------

export interface TrendingCategory {
    id: string;
    name: string;
    subtitle: string;
    image: string;
}

export const MOCK_TRENDING_CATEGORIES: TrendingCategory[] = [
    {
        id: "tc-1",
        name: "Statement Rings",
        subtitle: "Starting ₹1,299",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB76thteAgktTn0HNEG5GMxHNSWoL0kHsVLqeec4t4b9D5_OwoJG-bxt96nhZZLN5oq9oxH2MSRPVLcDWwXkTTp7sAd23ujYtj1F49YeW0gDnT0QcCvsS3jTp0StElUtppjSOM8B_xLu8ad6vmZcIuglKFCZ1i8-TUPrYEO440bghSw9Qchepv0nP5KqMaXl7Pfk7qMqRTd_yTa9eJsT_0fPHF0eDsJjCXVI8W9qk48se4w6iY2ELVXk_oqNs8jojh670sgEuWPp94",
    },
    {
        id: "tc-2",
        name: "Dainty Chains",
        subtitle: "Starting ₹899",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkOsaoWv2Zo9X7Cr60pk1RW05SM_KI9EMSIlidykWV06NGfwVdSiliA8ob1FVc7Ka2VeVSoz8kvqVLWMsvn8yrmOMTuVUbvs812wR4b80-z4EIRlS-ZueXDc7pF1cV01rrbcBGDBHeWhdRZdAxkDyS8HlaEcjDNvmFqA-LR4Nukl2k5A-PerBqCJC-3Db03ra_NuNDviOPkc7E5qRxelwoCegh8uXINAMBaEa4oY7Gltoavi_pqwGHnZfGXtOXIj6IbJ8FQXbvX4",
    },
    {
        id: "tc-3",
        name: "Modern Pearls",
        subtitle: "New Collection",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCTwKaoNCqfbLaoB2vqmZdvIGHEJfdm1W0ld__zm7xeVf_id5X5IzcX3Eftl-rG3a2qBftz7IUQjTW0q5h82iSwMmaYlQp_52xiKf8ROq5ntDg7Ec5hLGAVfAlH43VNJ4Wjk1T-nbHO6wqp4E39v5KECnVWwi1XOIyBPwqxD-KpwB0oz95xDu7grEdgOhYCOuWvgYcNlYORYw739exBQa7nfXQYTUSKXN_TnHzxHQ6hJ6ThPyZg5P0IpkcQB72ED_BStKLUzGJt_o8",
    },
    {
        id: "tc-4",
        name: "Office Wear",
        subtitle: "Under ₹1499",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDqrNsIrvDIDLjJKzdXNRxvFpYg85rsyMJTTEQtqWsfQYmWXFZj3_LttfmlIRIUcvia1dPghxq33YMNgczRT6zF-TO2nKTv2XuPJJSnQHAagbHq4aPPT8VWFkMDkXg3guMloZLbOY8FAcqAji6CeBU6pt4ooZhOrv8KGA13CvqBQgsZSHCJZbJJh8uh8L4h5vv-fZBniOMOR3tBjDCX5N4VGXQQwewTpvgUG-6ootfP5g4OEedRrPa3FdAnjkz3hETK1Mz8hkH_1Vs",
    },
];
