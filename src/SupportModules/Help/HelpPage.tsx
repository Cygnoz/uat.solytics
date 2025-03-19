import { useEffect, useState } from "react";
import GoBackButton from "../../components/Ui/GoBackButton";
import { useRegularApi } from "../../context/ApiContext";
import SearchBar from "../../components/Ui/SearchBar";
import NoRecords from "../../components/Ui/NoRecords";

const HelpPage = () => {
    const { refreshContext, allArticles, allCategory } = useRegularApi();
    useEffect(() => {
        refreshContext({ articles: true, category: true });
    }, []);

    const [activeTab, setActiveTab] = useState("All");
    const [searchValue, setSearchValue] = useState("");
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    // Get category names including "All"
    const tabs = ["All", ...allCategory.map((cat:any) => cat.categoryName)];

    // Filter articles based on selected category
    const filteredArticles = (activeTab === "All"
        ? [...allArticles]
        : [...allArticles].filter((article: any) => 
            article.category._id === allCategory.find((cat: any) => cat.categoryName === activeTab)?._id
        )
    )
    .reverse()
    .filter((article: any) => {
        const searchLower = searchValue.toLowerCase();
        return (
            article.title.toLowerCase().includes(searchLower) || // 🔍 Match title
            article.content?.toLowerCase().includes(searchLower) || // 🔍 Match content (optional chaining in case content is null)
            article.category.categoryName.toLowerCase().includes(searchLower) // 🔍 Match category name
        );
    });

    console.log("de",allArticles);
    
    
    
    return (
        <div className="px-3 pb-2">
        <GoBackButton />
        <div className="my-3">
            <p className="mb-2 text-[#177BDA] text-2xl font-medium">Help</p>
            <p className="text-[#919191] text-sm font-normal">
                Explore guides, FAQs, and get quick assistance from our AI for any questions or issues.
            </p>
        </div>
    
        <SearchBar 
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            placeholder="Search Helps" 
        />
        
        <div className="overflow-x-auto custom-scrollbar">
    <div className="flex rounded-xl gap-2 py-2 text-sm  w-max">
        {tabs.map((tab) => (
            <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer py-2 px-[16px] ${
                    activeTab === tab
                        ? "text-[#0177F2] text-sm font-medium bg-[#A8D3FD] rounded-md"
                        : "bg-[#D7E2EE] text-[#A8B0B8] font-medium rounded-md"
                }`}
            >
                {tab}
            </div>
        ))}
    </div>
</div>

    
        {/* Scrollable section only when articles are more than 4 */}
        <div className={`max-h-[400px]  overflow-y-auto hide-scrollbar`}>
    {filteredArticles.length === 0 ? (
        <NoRecords text="No Helps Found!" parentHeight="400px" />
    ) : (
        filteredArticles.map((article: any, index: number) => (
            <div 
    key={article._id} 
    className="bg-[#F3F9FF] p-4 rounded-2xl my-4 text-center shadow-sm transition-all duration-300 hover:shadow-md"
>
    <p className="text-[#0F2A43] text-lg font-semibold mb-2">{article.title}</p>
    
    {/* Show truncated content only when the article is not expanded */}
    {expandedIndex !== index && (
        <p className="text-[#A19999] text-sm font-normal mt-2">
            {`${article.content.slice(0, 50)}...`}
        </p>
    )}

    {/* Show full content only when the article is expanded */}
    {expandedIndex === index && (
        <>
            {article.image && (
                <div className="flex justify-center my-2">
                    <img src={article.image} alt="Article" className="w-full max-w-[250px] rounded-lg shadow-sm" />
                </div>
            )}
            <p className="text-[#A19999] text-sm font-normal mt-2">{article.content}</p>
        </>
    )}

    {/* Read More Button */}
    {(article.content.length > 50 || article.image) && (
        <p 
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} 
            className="text-right text-[#177BDA] text-sm font-medium mt-2 cursor-pointer hover:underline"
        >
            {expandedIndex === index ? "Read less..." : "Read more..."}
        </p>
    )}
</div>


        ))
    )}
</div>

    </div>
    
    );
};

export default HelpPage;