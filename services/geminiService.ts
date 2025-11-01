
import { GoogleGenAI, Modality } from "@google/genai";
import { HalloweenStyle } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getStylePrompt = (style: HalloweenStyle): string => {
  switch (style) {
    case "Phù Thủy Rừng Xanh":
      return "Tạo chân dung một người ngồi khoanh chân ở trung tâm tiền cảnh, ánh mắt nhìn thẳng vào người xem với vẻ mặt nghiêm nghị, điềm tĩnh. Họ mặc một bộ trang phục tối màu, nhiều lớp với các chi tiết tinh xảo. Họ cầm một cuốn sách ma thuật mở. Bối cảnh là một khu rừng phủ đầy lá mùa thu rụng, trong màn sương mù dày đặc. Xung quanh họ là một chiếc vạc lớn màu đen, nhiều ngọn nến đen đang cháy, một con quạ đậu trên cành cây và những chai thuốc nhỏ.";
    case "Nữ Hoàng Ma Cà Rồng":
      return "Tạo hình nhân vật đang ngồi trên một ngai vàng gothic trang trí công phu trong một đại sảnh lâu đài thiếu ánh sáng. Họ mặc một chiếc váy nhung đỏ hoặc đen sang trọng, với cổ áo cao và trang sức bạc lấp lánh. Một tay họ cầm một chiếc ly bạc chứa chất lỏng màu đỏ sẫm. Ánh sáng kịch tính từ một cửa sổ lớn chiếu vào, tạo ra bóng tối sâu thẳm. Biểu cảm của họ quyền lực và quyến rũ, với đôi mắt có một chút nguy hiểm.";
    case "Thợ Săn Quỷ":
      return "Nhân vật đứng trong một con hẻm tối tăm, ẩm ướt của thành phố hoặc một tàn tích cổ xưa. Họ mặc áo khoác da, áo giáp nhẹ và nhiều dây đai mang theo vũ khí thần bí (kiếm có khắc chữ cổ, nỏ). Một tay họ cầm vũ khí chính đang phát ra ánh sáng mờ ảo. Ánh mắt họ sắc bén, tập trung, sẵn sàng chiến đấu. Bầu không khí căng thẳng, với sương mù và ánh sáng yếu ớt từ đèn đường hoặc mặt trăng.";
    case "Phù Thủy Cyberpunk":
      return "Nhân vật đứng trên sân thượng một tòa nhà chọc trời, nhìn xuống thành phố cyberpunk rực rỡ ánh đèn neon. Họ mặc trang phục công nghệ cao kết hợp với các biểu tượng huyền bí. Các hình xăm phát sáng hoặc các bộ phận cơ thể được tăng cường bằng máy móc có thể nhìn thấy. Họ đang thực hiện một câu thần chú, với các vòng tròn năng lượng ba chiều và các ký tự số phát sáng xung quanh tay họ. Không khí tràn ngập mưa nhẹ và phản chiếu ánh đèn neon.";
    case "Linh Hồn Bí Ngô":
      return "Nhân vật đứng giữa một cánh đồng bí ngô vào ban đêm, dưới ánh trăng tròn. Họ mặc trang phục mộc mạc, màu đất, được trang trí bằng dây leo và lá cây. Làn da của họ phát ra ánh sáng màu cam ấm áp từ bên trong. Xung quanh họ, những quả bí ngô được khắc hình mặt cười cũng đang phát sáng. Không khí huyền ảo và một chút kỳ lạ, với sương mù lượn lờ trên mặt đất.";
    case "Hồn Ma Gothic":
      return "Nhân vật hiện ra như một hình ảnh mờ ảo, gần như trong suốt, đang trôi nổi trong một hành lang của một biệt thự cổ bỏ hoang. Họ mặc một bộ trang phục thời Victoria đã cũ và rách nát. Ánh trăng chiếu qua một cửa sổ vỡ, làm nổi bật hình dáng của họ. Biểu cảm của họ buồn bã và u sầu, như thể đang tìm kiếm điều gì đó đã mất. Không khí lạnh lẽo và tĩnh lặng, với bụi bay trong không khí.";
    case "Ngôi Sao Rock Zombie":
      return "Nhân vật đang biểu diễn trên một sân khấu tối, được chiếu sáng bởi đèn sân khấu đầy màu sắc. Họ mặc quần áo rock 'n' roll rách rưới, da của họ nhợt nhạt và có vài vết thương giả. Họ đang hét vào micro hoặc chơi một cây guitar điện một cách cuồng nhiệt. Đám đông zombie mờ ảo có thể được nhìn thấy ở hậu cảnh. Năng lượng cao và hỗn loạn, kết hợp giữa sự quyến rũ của rock và sự kinh dị của zombie.";
    case "Bù Nhìn Bị Nguyền Rủa":
      return "Nhân vật đứng sừng sững trong một cánh đồng ngô khô héo vào lúc hoàng hôn. Họ mặc quần áo cũ kỹ, chắp vá làm từ bao tải, với rơm rạ thò ra ở cổ tay áo và cổ áo. Một chiếc mũ rơm cũ che khuất một phần khuôn mặt. Đôi mắt họ phát sáng một cách đáng sợ từ trong bóng tối. Một đàn quạ bay trên đầu. Bầu không khí im lặng và đầy đe dọa.";
    case "Cổ Trang Ma Mị":
      return "Nhân vật mặc bộ trang phục cổ trang Việt Nam hoặc Á Đông với các tông màu tối và các họa tiết huyền bí. Họ đứng trong một ngôi đền cổ bị bỏ hoang, với những bức tượng phủ đầy rêu và những cây cột gỗ mục nát. Xung quanh họ là những lá bùa phát sáng mờ ảo đang bay lơ lửng và khói hương lượn lờ. Ánh sáng yếu ớt, tạo cảm giác bí ẩn và tâm linh.";
    case "Thiên Thần Sa Ngã":
      return "Nhân vật đứng trên rìa một mái nhà thờ gothic trong một đêm mưa bão. Họ có đôi cánh lông vũ lớn màu đen hoặc xám, một số chiếc lông bị gãy hoặc tả tơi. Họ mặc trang phục kết hợp giữa màu trắng và đen, biểu thị sự xung đột nội tâm. Biểu cảm của họ đau khổ và mạnh mẽ, nhìn lên bầu trời đầy sấm sét. Bối cảnh đầy kịch tính và bi thảm.";
    case "Xác Sống Ai Cập":
      return "Nhân vật từ từ bước ra từ một chiếc quách bằng đá trong một lăng mộ Ai Cập cổ đại. Họ được quấn trong những dải băng vải cũ, một số dải bị bung ra để lộ làn da khô héo bên dưới. Họ đeo trang sức vàng và các biểu tượng hoàng gia. Các bức tường của lăng mộ được bao phủ bởi chữ tượng hình phát sáng. Không khí khô và cổ xưa, với ánh sáng từ những ngọn đuốc lập lòe.";
    case "Tên Hề Quái Dị":
      return "Nhân vật ngồi trên một chiếc xích đu cũ trong một khu hội chợ bị bỏ hoang vào ban đêm. Lớp trang điểm của họ bị nhòe và nụ cười của họ được vẽ quá rộng, trông đáng sợ hơn là vui vẻ. Họ mặc một bộ trang phục hề sặc sỡ nhưng bẩn thỉu và rách nát. Họ cầm một quả bóng bay màu đỏ duy nhất. Ánh sáng duy nhất đến từ một bóng đèn nhấp nháy ở xa, tạo ra những cái bóng dài và kỳ lạ.";
    case "Người Sói Dữ Tợn":
      return "Nhân vật đang trong quá trình biến đổi, quỳ trên mặt đất trong một khu rừng rậm dưới ánh trăng tròn. Quần áo của họ bị xé toạc, để lộ lông thú đang mọc ra. Móng vuốt của họ đang dài ra, và đôi mắt họ phát sáng màu vàng hoặc đỏ. Biểu cảm của họ là sự pha trộn giữa đau đớn và giận dữ nguyên thủy. Không khí hoang dã và nguy hiểm.";
    case "Đầu Lâu Mexico":
      return "Nhân vật có khuôn mặt được trang điểm theo phong cách Calavera (đầu lâu đường) của Lễ hội người chết Mexico, với các chi tiết hoa văn phức tạp và màu sắc rực rỡ. Họ đội một vòng hoa cúc vạn thọ lớn trên tóc và mặc một chiếc váy truyền thống đầy màu sắc. Họ được bao quanh bởi rất nhiều nến và hoa cúc vạn thọ. Bầu không khí lễ hội, tôn kính và đẹp một cách kỳ lạ.";
    case "Kỵ Sĩ Không Đầu":
      return "Nhân vật cưỡi một con ngựa đen hùng vĩ phi nước đại qua một con đường rừng tối tăm. Họ mặc một chiếc áo choàng đen bay trong gió. Họ cầm một chiếc đèn lồng bí ngô được chạm khắc đáng sợ và phát sáng rực rỡ, chiếu sáng con đường phía trước. Bầu không khí căng thẳng và đầy hành động, lấy cảm hứng từ truyền thuyết Sleepy Hollow.";
    case "Nàng Tiên Hắc Ám":
      return "Nhân vật đứng trong một khu rừng phép thuật vào ban đêm, được chiếu sáng bởi những cây nấm phát quang và những con đom đóm. Họ có đôi cánh giống như cánh chuồn chồn hoặc cánh bướm nhưng có màu tối và lấp lánh. Họ mặc một chiếc váy làm từ lá cây và mạng nhện. Xung quanh họ là những dây gai và những bông hoa kỳ lạ phát sáng. Biểu cảm của họ tinh nghịch và có chút hiểm ác.";
    case "Nhà Giả Kim Điên Loạn":
      return "Nhân vật đứng trong một phòng thí nghiệm lộn xộn, được chiếu sáng bởi ánh sáng kỳ lạ từ các bình thủy tinh chứa đầy chất lỏng sủi bọt và phát sáng. Họ mặc một chiếc áo khoác da cũ, đeo kính bảo hộ trên trán. Họ đang cầm một bình thuốc đang bốc khói, nhìn vào nó với vẻ mặt cuồng nhiệt của một nhà phát minh. Các kệ sách chứa đầy những cuốn sách cổ và các biểu đồ chiêm tinh phức tạp.";
    default:
      return `Biến người trong bức ảnh này thành một "${style}". Phong cách phải kỳ lạ, huyền bí, đậm chất điện ảnh và hoàn hảo cho Halloween. Hình ảnh cuối cùng phải là một bức chân dung nghệ thuật, chi tiết và chất lượng cao.`;
  }
};

const generatePrompt = (style: HalloweenStyle, lockFace: boolean, customPrompt: string): string => {
  const basePrompt = getStylePrompt(style);
  const customPromptPart = customPrompt.trim() ? ` ${customPrompt.trim()}.` : '';
  const enhancement = "Ảnh cosplay điện ảnh 8K siêu thực, kết cấu quần áo, da, tóc và đồ vật siêu thực, ánh sáng kịch tính, độ chi tiết cao.";
  const faceLockInstruction = lockFace 
    ? "Điều quan trọng nhất là phải giữ lại các đặc điểm khuôn mặt và sự tương đồng của người trong ảnh gốc. Kết quả phải trông giống hệt người đó, nhưng trong bối cảnh và trang phục được mô tả."
    : "Có thể tự do sáng tạo nghệ thuật hơn, không cần quá giống với các đường nét trên khuôn mặt, miễn là nó phù hợp với phong cách.";
  
  return `${basePrompt}${customPromptPart} ${enhancement} ${faceLockInstruction}`;
};

export const generateHalloweenImages = async (
  imageFile: File,
  style: HalloweenStyle,
  lockFace: boolean,
  customPrompt: string,
  apiKey: string
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey });
  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: generatePrompt(style, lockFace, customPrompt) };
  
  const model = 'gemini-2.5-flash-image';
  const numberOfImages = 3;

  const generationPromises = Array(numberOfImages).fill(0).map(() => {
    return ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
  });

  const responses = await Promise.all(generationPromises);

  const imageUrls: string[] = responses.map(response => {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Không tìm thấy dữ liệu hình ảnh trong phản hồi.");
  }).filter(url => url);

  if (imageUrls.length === 0) {
    throw new Error("Quá trình tạo ảnh không thành công, không có kết quả nào.");
  }
  
  return imageUrls;
};
